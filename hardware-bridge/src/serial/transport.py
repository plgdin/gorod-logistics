"""Serial transport, hardware simulator, and connection state machine."""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass
from enum import Enum
from typing import Awaitable, Callable

import serial

logger = logging.getLogger("gorod.bridge.transport")


class ConnectionState(str, Enum):
    DISCONNECTED = "DISCONNECTED"
    DISCOVERING = "DISCOVERING"
    CONNECTING = "CONNECTING"
    CONNECTED = "CONNECTED"
    RECEIVING = "RECEIVING"
    RECONNECTING = "RECONNECTING"
    ERROR = "ERROR"


@dataclass(frozen=True)
class SerialConfig:
    port: str
    baud_rate: int = 9600
    data_bits: int = 8
    parity: str = "N"
    stop_bits: float = 1.0
    mode: str = "hardware"  # 'hardware' | 'simulator'


SIMULATOR_SCENARIOS: dict[str, list[bytes]] = {
    "zero": [b"ST,GS,+0000.00 kg\r\n"],
    "small_1kg": [b"ST,GS,+0001.00 kg\r\n"],
    "decimal_24_6": [b"ST,GS,+0024.60 kg\r\n"],
    "heavy_1254_2": [b"ST,GS,+1254.20 kg\r\n"],
    "unstable": [
        b"US,GS,+0102.30 kg\r\n",
        b"US,GS,+0104.80 kg\r\n",
        b"US,GS,+0103.10 kg\r\n",
    ],
    "negative": [b"ST,GS,-0002.40 kg\r\n"],
    "overload": [b"OL,GS,+9999.99 kg\r\n"],
    "malformed": [b"??BAD#PKT\r\n", b"ST,GS,+0024.60 kg\r\n"],
    "within_threshold_103": [b"ST,GS,+0103.00 kg\r\n"],
    "exact_boundary_105": [b"ST,GS,+0105.00 kg\r\n"],
    "breach_105_1": [b"ST,GS,+0105.10 kg\r\n"],
    "breach_94_9": [b"ST,GS,+0094.90 kg\r\n"],
    "software_stable_stream": [b"0150.25 kg\r\n"],
}


class SerialBridgeTransport:
    """Manages async reading from either PySerial hardware or deterministic simulator."""

    def __init__(
        self,
        on_bytes: Callable[[bytes], Awaitable[None]],
        on_state: Callable[[ConnectionState, str | None], Awaitable[None]],
        reconnect_interval_sec: float = 3.0,
        max_reconnect_attempts: int = 10,
    ) -> None:
        self._on_bytes = on_bytes
        self._on_state = on_state
        self._reconnect_interval = reconnect_interval_sec
        self._max_reconnect_attempts = max_reconnect_attempts

        self._config: SerialConfig | None = None
        self._state = ConnectionState.DISCONNECTED
        self._stop_event = asyncio.Event()
        self._task: asyncio.Task | None = None
        self._serial: serial.Serial | None = None
        self._sim_scenario: str = "heavy_1254_2"
        self._sim_force_disconnect = False

    @property
    def state(self) -> ConnectionState:
        return self._state

    @property
    def config(self) -> SerialConfig | None:
        return self._config

    @property
    def sim_scenario(self) -> str:
        return self._sim_scenario

    async def _set_state(self, state: ConnectionState, error: str | None = None) -> None:
        self._state = state
        await self._on_state(state, error)

    async def connect(self, config: SerialConfig) -> None:
        await self.disconnect()
        self._config = config
        self._stop_event.clear()
        self._sim_force_disconnect = False
        self._task = asyncio.create_task(self._run_loop(config))

    async def disconnect(self) -> None:
        self._stop_event.set()
        if self._serial is not None:
            try:
                self._serial.close()
            except Exception:
                pass
            self._serial = None
        if self._task is not None:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None
        await self._set_state(ConnectionState.DISCONNECTED, None)

    async def reconnect(self) -> None:
        if self._config is None:
            await self._set_state(ConnectionState.ERROR, "No previous port configuration to reconnect.")
            return
        await self.connect(self._config)

    def set_simulator_scenario(self, scenario: str) -> None:
        if scenario == "disconnect":
            self._sim_force_disconnect = True
            return
        if scenario not in SIMULATOR_SCENARIOS:
            raise ValueError(f"Unknown simulator scenario: {scenario}")
        self._sim_force_disconnect = False
        self._sim_scenario = scenario

    async def _run_loop(self, config: SerialConfig) -> None:
        if config.mode == "simulator":
            await self._run_simulator()
            return
        await self._run_hardware(config)

    async def _run_simulator(self) -> None:
        await self._set_state(ConnectionState.CONNECTING, None)
        await asyncio.sleep(0.15)
        await self._set_state(ConnectionState.CONNECTED, None)
        idx = 0

        try:
            while not self._stop_event.is_set():
                if self._sim_force_disconnect:
                    await self._set_state(ConnectionState.ERROR, "Simulated serial link dropped.")
                    return

                frames = SIMULATOR_SCENARIOS.get(self._sim_scenario, [b"ST,GS,+0000.00 kg\r\n"])
                chunk = frames[idx % len(frames)]
                idx += 1

                if self._state != ConnectionState.RECEIVING:
                    await self._set_state(ConnectionState.RECEIVING, None)
                await self._on_bytes(chunk)
                await asyncio.sleep(0.45)
        except asyncio.CancelledError:
            raise

    async def _run_hardware(self, config: SerialConfig) -> None:
        attempts = 0
        while not self._stop_event.is_set():
            try:
                await self._set_state(
                    ConnectionState.RECONNECTING if attempts > 0 else ConnectionState.CONNECTING,
                    None,
                )
                self._serial = await asyncio.to_thread(
                    serial.Serial,
                    port=config.port,
                    baudrate=config.baud_rate,
                    bytesize=config.data_bits,
                    parity=config.parity,
                    stopbits=config.stop_bits,
                    timeout=0.25,
                )
                attempts = 0
                await self._set_state(ConnectionState.CONNECTED, None)
                logger.info("Serial port connected: port=%s baud=%s", config.port, config.baud_rate)
                last_rx = time.monotonic()
                silent_warned = False

                while not self._stop_event.is_set():
                    chunk = await asyncio.to_thread(self._read_serial_chunk, self._serial)
                    if chunk:
                        last_rx = time.monotonic()
                        silent_warned = False
                        if self._state != ConnectionState.RECEIVING:
                            await self._set_state(ConnectionState.RECEIVING, None)
                        await self._on_bytes(chunk)
                    else:
                        if not silent_warned and (time.monotonic() - last_rx) >= 6.0:
                            silent_warned = True
                            logger.warning(
                                "Serial port open but no data received: port=%s", config.port
                            )
                        await asyncio.sleep(0.05)

            except asyncio.CancelledError:
                raise
            except serial.SerialException as exc:
                logger.warning("Serial connection error: port=%s err=%s", config.port, exc)
                if self._serial is not None:
                    try:
                        self._serial.close()
                    except Exception:
                        pass
                    self._serial = None

                attempts += 1
                if attempts > self._max_reconnect_attempts:
                    await self._set_state(ConnectionState.ERROR, f"Serial error on {config.port}: {exc}")
                    return

                await self._set_state(
                    ConnectionState.RECONNECTING,
                    f"Reconnecting ({attempts}/{self._max_reconnect_attempts}): {exc}",
                )
                await asyncio.sleep(self._reconnect_interval)
            finally:
                if self._serial is not None:
                    try:
                        self._serial.close()
                    except Exception:
                        pass
                    self._serial = None

    @staticmethod
    def _read_serial_chunk(ser: serial.Serial) -> bytes:
        waiting = ser.in_waiting
        return ser.read(waiting if waiting > 0 else 1)

