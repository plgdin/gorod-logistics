"""Core bridge orchestration: COM discovery, packet parsing, weight & diagnostics broadcast."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Awaitable, Callable

from src.config.settings import BridgeSettings
from src.parser.weight_parser import SerialPacketBuffer, WeightProcessor
from src.serial.discovery import discover_serial_ports
from src.serial.transport import ConnectionState, SerialBridgeTransport, SerialConfig

logger = logging.getLogger("gorod.bridge.service")


class ScaleBridgeService:
    """Connects serial/simulator transport to WeightProcessor and WebSocket subscribers."""

    def __init__(
        self,
        settings: BridgeSettings,
        broadcast: Callable[[dict[str, Any]], Awaitable[None]],
    ) -> None:
        self._settings = settings
        self._broadcast = broadcast
        self._buffer = SerialPacketBuffer()
        self._processor = WeightProcessor(
            window_size=settings.stability_window_size,
            tolerance_kg=settings.stability_tolerance_kg,
            min_duration_ms=settings.stability_min_duration_ms,
        )
        self._transport = SerialBridgeTransport(
            on_bytes=self._handle_bytes,
            on_state=self._handle_state,
            reconnect_interval_sec=settings.reconnect_interval_sec,
            max_reconnect_attempts=settings.max_reconnect_attempts,
        )
        self._diagnostics_enabled = False
        self._total_bytes = 0
        self._last_weight_payload: dict[str, Any] | None = None

    def current_status_payload(self) -> dict[str, Any]:
        cfg = self._transport.config
        return {
            "type": "CONNECTION_STATUS",
            "status": self._transport.state.value,
            "device": "SIMULATOR" if (cfg and cfg.mode == "simulator") else "HC-05 / Casio Scale",
            "port": cfg.port if cfg else None,
            "baudRate": cfg.baud_rate if cfg else self._settings.default_baud_rate,
            "mode": cfg.mode if cfg else "hardware",
            "scenario": self._transport.sim_scenario if (cfg and cfg.mode == "simulator") else None,
            "error": None,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def last_weight_payload(self) -> dict[str, Any] | None:
        return self._last_weight_payload

    async def list_ports(self) -> dict[str, Any]:
        await self._broadcast(
            {
                "type": "CONNECTION_STATUS",
                "status": ConnectionState.DISCOVERING.value,
                "device": "HC-05 / Casio Scale",
                "port": self._transport.config.port if self._transport.config else None,
                "mode": self._transport.config.mode if self._transport.config else "hardware",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )
        ports = [item.to_dict() for item in discover_serial_ports()]
        await self._broadcast(self.current_status_payload())
        return {
            "type": "PORTS_LIST",
            "ports": ports,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    async def connect(
        self,
        port: str,
        baud_rate: int | None = None,
        data_bits: int | None = None,
        parity: str | None = None,
        stop_bits: float | None = None,
        mode: str = "hardware",
    ) -> None:
        self._buffer.clear()
        self._processor.reset()
        self._total_bytes = 0
        self._last_weight_payload = None

        cfg = SerialConfig(
            port=port,
            baud_rate=baud_rate or self._settings.default_baud_rate,
            data_bits=data_bits or self._settings.default_data_bits,
            parity=(parity or self._settings.default_parity).upper(),
            stop_bits=stop_bits or self._settings.default_stop_bits,
            mode=mode if mode in ("hardware", "simulator") else "hardware",
        )
        await self._transport.connect(cfg)

    async def disconnect(self) -> None:
        self._buffer.clear()
        self._processor.reset()
        await self._transport.disconnect()

    async def reconnect(self) -> None:
        self._buffer.clear()
        self._processor.reset()
        await self._transport.reconnect()

    def set_diagnostics(self, enabled: bool) -> None:
        self._diagnostics_enabled = bool(enabled)

    def set_simulator_scenario(self, scenario: str) -> None:
        self._processor.reset()
        self._transport.set_simulator_scenario(scenario)

    async def _handle_state(self, state: ConnectionState, error: str | None) -> None:
        cfg = self._transport.config
        payload = {
            "type": "CONNECTION_STATUS",
            "status": state.value,
            "device": "SIMULATOR" if (cfg and cfg.mode == "simulator") else "HC-05 / Casio Scale",
            "port": cfg.port if cfg else None,
            "baudRate": cfg.baud_rate if cfg else self._settings.default_baud_rate,
            "mode": cfg.mode if cfg else "hardware",
            "scenario": self._transport.sim_scenario if (cfg and cfg.mode == "simulator") else None,
            "error": error,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        await self._broadcast(payload)

    async def _handle_bytes(self, chunk: bytes) -> None:
        self._total_bytes += len(chunk)
        cfg = self._transport.config
        mode = cfg.mode if cfg else "hardware"

        if self._diagnostics_enabled:
            ascii_text = chunk.decode("ascii", errors="replace").replace("\r", "\\r").replace("\n", "\\n")
            hex_text = " ".join(f"{b:02X}" for b in chunk)
            await self._broadcast(
                {
                    "type": "DIAGNOSTIC_LOG",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "byteCount": len(chunk),
                    "totalBytes": self._total_bytes,
                    "ascii": ascii_text,
                    "hex": hex_text,
                    "port": cfg.port if cfg else None,
                    "baudRate": cfg.baud_rate if cfg else None,
                }
            )

        for packet in self._buffer.feed(chunk):
            processed = self._processor.process_packet(packet)
            payload = processed.to_ws_payload(mode=mode)
            self._last_weight_payload = payload
            await self._broadcast(payload)

