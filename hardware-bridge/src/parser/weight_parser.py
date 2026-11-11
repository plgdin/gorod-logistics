"""Weight packet buffer, protocol parser, unit normalizer, and stability engine."""

from __future__ import annotations

import re
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Literal

StabilitySource = Literal["DEVICE", "SOFTWARE", "UNSTABLE"]

UNIT_TO_KG = {
    "kg": 1.0,
    "kgs": 1.0,
    "g": 0.001,
    "gm": 0.001,
    "gms": 0.001,
    "lb": 0.45359237,
    "lbs": 0.45359237,
    "t": 1000.0,
    "ton": 1000.0,
    "mt": 1000.0,
}

# Matches common Casio / industrial indicator ASCII frames:
# Examples:
#   "ST,GS,+  1254.20 kg"
#   "US,NT,-0005.4 kg"
#   "ST +1254.2 kg"
#   "+0024.6kg"
#   "0.000 kg"
#   "1254.2"
STATUS_PREFIX_RE = re.compile(
    r"^(?P<status>ST|US|OL|OK|GS|NT|TR|M\+)(?:[\s,;:]+(?P<substatus>GS|NT|TR|ST|US|OL))?[\s,;:]+",
    re.IGNORECASE,
)
OVERLOAD_RE = re.compile(
    r"\b(OL|OVER|OVERLOAD|ERR|EEEE|-----|\+\+\+\+\+)\b",
    re.IGNORECASE,
)
VALUE_UNIT_RE = re.compile(
    r"(?P<sign>[+-])?\s*(?P<num>\d+(?:\.\d+)?)\s*(?P<unit>kgs?|gms?|g|lbs?|lb|mt|ton|t)?\b",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class ParsedReading:
    valid: bool
    raw: str
    weight_kg: float | None = None
    raw_weight: float | None = None
    raw_unit: str = "kg"
    device_stable: bool | None = None
    overload: bool = False
    error: str | None = None


@dataclass(frozen=True)
class ProcessedWeight:
    weight: float | None
    unit: str
    raw_weight: float | None
    raw_unit: str
    stable: bool
    stability_source: StabilitySource
    overload: bool
    invalid: bool
    raw: str
    timestamp: str
    error: str | None = None

    def to_ws_payload(self, mode: str) -> dict:
        return {
            "type": "WEIGHT_UPDATE",
            "weight": self.weight,
            "unit": self.unit,
            "rawWeight": self.raw_weight,
            "rawUnit": self.raw_unit,
            "stable": self.stable,
            "stabilitySource": self.stability_source,
            "overload": self.overload,
            "invalid": self.invalid,
            "raw": self.raw,
            "timestamp": self.timestamp,
            "mode": mode,
            "error": self.error,
        }


def normalize_unit(unit: str | None) -> str:
    if not unit:
        return "kg"
    lowered = unit.strip().lower()
    if lowered in ("kg", "kgs"):
        return "kg"
    if lowered in ("g", "gm", "gms"):
        return "g"
    if lowered in ("lb", "lbs"):
        return "lb"
    if lowered in ("t", "ton", "mt"):
        return "t"
    return lowered


def to_kilograms(value: float, unit: str) -> float:
    norm = normalize_unit(unit)
    factor = UNIT_TO_KG.get(norm)
    if factor is None:
        raise ValueError(f"Unsupported weight unit: {unit}")
    return round(value * factor, 4)


def parse_weight_packet(packet: str) -> ParsedReading:
    """Parse a single indicator line into structured weight data."""
    cleaned = packet.strip("\x00\x02\x03\r\n ")
    if not cleaned:
        return ParsedReading(valid=False, raw=packet, error="Empty packet")

    device_stable: bool | None = None
    working = cleaned

    prefix_match = STATUS_PREFIX_RE.match(working)
    if prefix_match:
        status = (prefix_match.group("status") or "").upper()
        sub = (prefix_match.group("substatus") or "").upper()
        tokens = {status, sub}
        if "OL" in tokens:
            return ParsedReading(
                valid=False,
                raw=cleaned,
                overload=True,
                device_stable=False,
                error="Scale overload",
            )
        if "ST" in tokens or "OK" in tokens:
            device_stable = True
        elif "US" in tokens:
            device_stable = False
        working = working[prefix_match.end() :].strip()

    if OVERLOAD_RE.search(cleaned):
        return ParsedReading(
            valid=False,
            raw=cleaned,
            overload=True,
            device_stable=False,
            error="Scale overload",
        )

    # Check single letter/word stability markers like "S 12.5 kg" or "U 12.5 kg"
    if device_stable is None:
        token_match = re.match(r"^(S|STABLE|U|UNSTABLE)\s+", working, re.IGNORECASE)
        if token_match:
            flag = token_match.group(1).upper()
            device_stable = flag in ("S", "STABLE")
            working = working[token_match.end() :].strip()

    match = VALUE_UNIT_RE.search(working)
    if not match:
        return ParsedReading(valid=False, raw=cleaned, error="Malformed packet: no numeric reading")

    # Reject garbage with trailing unexpected text right inside numeric expression
    remainder = (working[: match.start()] + working[match.end() :]).strip(" ,;")
    if remainder and not re.fullmatch(r"(NET|GROSS|N|G|WT|W)?", remainder, re.IGNORECASE):
        return ParsedReading(valid=False, raw=cleaned, error=f"Malformed packet: unexpected token '{remainder}'")

    sign = -1.0 if match.group("sign") == "-" else 1.0
    raw_value = sign * float(match.group("num"))
    raw_unit = normalize_unit(match.group("unit"))

    try:
        weight_kg = to_kilograms(raw_value, raw_unit)
    except ValueError as exc:
        return ParsedReading(valid=False, raw=cleaned, error=str(exc))

    return ParsedReading(
        valid=True,
        raw=cleaned,
        weight_kg=weight_kg,
        raw_weight=round(raw_value, 4),
        raw_unit=raw_unit,
        device_stable=device_stable,
    )


class SerialPacketBuffer:
    """Accumulates incoming serial byte chunks and yields complete CR/LF/CRLF lines."""

    def __init__(self, max_buffer_bytes: int = 8192) -> None:
        self._buffer = bytearray()
        self._max_buffer_bytes = max_buffer_bytes

    def feed(self, chunk: bytes) -> list[str]:
        if not chunk:
            return []
        self._buffer.extend(chunk)
        if len(self._buffer) > self._max_buffer_bytes:
            # Drop stale overflow prefix so memory remains bounded on noisy lines.
            self._buffer = self._buffer[-self._max_buffer_bytes :]

        lines: list[str] = []
        while True:
            cr_idx = self._buffer.find(b"\r")
            lf_idx = self._buffer.find(b"\n")
            if cr_idx == -1 and lf_idx == -1:
                break

            if cr_idx != -1 and (lf_idx == -1 or cr_idx < lf_idx):
                sep_idx = cr_idx
                consume = 2 if (sep_idx + 1 < len(self._buffer) and self._buffer[sep_idx + 1] == ord("\n")) else 1
            else:
                sep_idx = lf_idx
                consume = 1

            raw_line = bytes(self._buffer[:sep_idx])
            del self._buffer[: sep_idx + consume]
            decoded = raw_line.decode("ascii", errors="replace")
            if decoded.strip("\x00\x02\x03 "):
                lines.append(decoded)

        return lines

    def clear(self) -> None:
        self._buffer.clear()


class WeightProcessor:
    """Combines packet parsing with hardware or configurable software stability detection."""

    def __init__(
        self,
        window_size: int = 5,
        tolerance_kg: float = 0.05,
        min_duration_ms: int = 1200,
    ) -> None:
        self._window_size = max(2, window_size)
        self._tolerance_kg = max(0.0, tolerance_kg)
        self._min_duration_sec = max(0.0, min_duration_ms / 1000.0)
        self._samples: deque[tuple[float, float]] = deque(maxlen=self._window_size)

    def reset(self) -> None:
        self._samples.clear()

    def process_packet(self, packet: str, now_mono: float | None = None) -> ProcessedWeight:
        ts_iso = datetime.now(timezone.utc).isoformat()
        now = time.monotonic() if now_mono is None else now_mono
        parsed = parse_weight_packet(packet)

        if parsed.overload:
            self.reset()
            return ProcessedWeight(
                weight=None,
                unit="kg",
                raw_weight=None,
                raw_unit=parsed.raw_unit,
                stable=False,
                stability_source="UNSTABLE",
                overload=True,
                invalid=False,
                raw=parsed.raw,
                timestamp=ts_iso,
                error=parsed.error,
            )

        if not parsed.valid or parsed.weight_kg is None:
            return ProcessedWeight(
                weight=None,
                unit="kg",
                raw_weight=None,
                raw_unit=parsed.raw_unit,
                stable=False,
                stability_source="UNSTABLE",
                overload=False,
                invalid=True,
                raw=parsed.raw,
                timestamp=ts_iso,
                error=parsed.error,
            )

        self._samples.append((now, parsed.weight_kg))

        # Prefer genuine device stability when supplied by the weighing indicator.
        if parsed.device_stable is True:
            return ProcessedWeight(
                weight=parsed.weight_kg,
                unit="kg",
                raw_weight=parsed.raw_weight,
                raw_unit=parsed.raw_unit,
                stable=True,
                stability_source="DEVICE",
                overload=False,
                invalid=False,
                raw=parsed.raw,
                timestamp=ts_iso,
            )

        if parsed.device_stable is False:
            return ProcessedWeight(
                weight=parsed.weight_kg,
                unit="kg",
                raw_weight=parsed.raw_weight,
                raw_unit=parsed.raw_unit,
                stable=False,
                stability_source="UNSTABLE",
                overload=False,
                invalid=False,
                raw=parsed.raw,
                timestamp=ts_iso,
            )

        # Indicator omitted stability flag: evaluate software stability window.
        sw_stable = self._is_software_stable()
        return ProcessedWeight(
            weight=parsed.weight_kg,
            unit="kg",
            raw_weight=parsed.raw_weight,
            raw_unit=parsed.raw_unit,
            stable=sw_stable,
            stability_source="SOFTWARE" if sw_stable else "UNSTABLE",
            overload=False,
            invalid=False,
            raw=parsed.raw,
            timestamp=ts_iso,
        )

    def _is_software_stable(self) -> bool:
        if len(self._samples) < self._window_size:
            return False
        values = [item[1] for item in self._samples]
        span = max(values) - min(values)
        elapsed = self._samples[-1][0] - self._samples[0][0]
        return span <= self._tolerance_kg and elapsed >= self._min_duration_sec

