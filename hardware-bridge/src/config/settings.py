"""Configuration loader for Gorod Logistics local weighing scale bridge."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class BridgeSettings:
    host: str = "127.0.0.1"
    port: int = 8765
    auth_token: str = "gorod-local-scale-token"
    allowed_origins: tuple[str, ...] = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    )
    default_baud_rate: int = 9600
    default_data_bits: int = 8
    default_parity: str = "N"
    default_stop_bits: float = 1.0
    reconnect_interval_sec: float = 3.0
    max_reconnect_attempts: int = 10
    stability_window_size: int = 5
    stability_tolerance_kg: float = 0.05
    stability_min_duration_ms: int = 1200
    log_level: str = "INFO"
    log_file: str = "logs/bridge.log"


def load_settings(config_path: str | Path | None = None) -> BridgeSettings:
    """Load bridge settings from JSON file and environment overrides."""
    raw: dict = {}
    candidate = Path(config_path) if config_path else Path(__file__).resolve().parents[2] / "config.json"
    if candidate.exists():
        raw = json.loads(candidate.read_text(encoding="utf-8"))

    env_host = os.getenv("GOROD_BRIDGE_HOST", raw.get("host", "127.0.0.1"))
    # Enforce localhost-only binding regardless of misconfiguration.
    if env_host not in ("127.0.0.1", "localhost", "::1"):
        env_host = "127.0.0.1"

    origins_raw = raw.get("allowed_origins", list(BridgeSettings.allowed_origins))
    env_origins = os.getenv("GOROD_BRIDGE_ORIGINS")
    if env_origins:
        origins_raw = [item.strip() for item in env_origins.split(",") if item.strip()]

    return BridgeSettings(
        host=env_host,
        port=int(os.getenv("GOROD_BRIDGE_PORT", raw.get("port", 8765))),
        auth_token=os.getenv("GOROD_BRIDGE_TOKEN", raw.get("auth_token", "gorod-local-scale-token")),
        allowed_origins=tuple(origins_raw),
        default_baud_rate=int(raw.get("default_baud_rate", 9600)),
        default_data_bits=int(raw.get("default_data_bits", 8)),
        default_parity=str(raw.get("default_parity", "N")).upper(),
        default_stop_bits=float(raw.get("default_stop_bits", 1.0)),
        reconnect_interval_sec=float(raw.get("reconnect_interval_sec", 3.0)),
        max_reconnect_attempts=int(raw.get("max_reconnect_attempts", 10)),
        stability_window_size=int(raw.get("stability_window_size", 5)),
        stability_tolerance_kg=float(raw.get("stability_tolerance_kg", 0.05)),
        stability_min_duration_ms=int(raw.get("stability_min_duration_ms", 1200)),
        log_level=str(raw.get("log_level", "INFO")).upper(),
        log_file=str(raw.get("log_file", "logs/bridge.log")),
    )

