"""Localhost-only authenticated WebSocket server for the Gorod Logistics ERP."""

from __future__ import annotations

import asyncio
import hmac
import json
import logging
from typing import Any
from urllib.parse import parse_qs, urlparse

from websockets.asyncio.server import ServerConnection, serve
from websockets.http11 import Request, Response

from src.config.settings import BridgeSettings
from src.services.bridge_service import ScaleBridgeService

logger = logging.getLogger("gorod.bridge.ws")

ALLOWED_BAUD_RATES = {1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200}
ALLOWED_DATA_BITS = {7, 8}
ALLOWED_PARITY = {"N", "E", "O"}
ALLOWED_STOP_BITS = {1, 1.0, 1.5, 2, 2.0}


def is_origin_allowed(origin: str | None, allowed_origins: tuple[str, ...]) -> bool:
    if not origin:
        return False
    normalized = origin.rstrip("/")
    return any(normalized == candidate.rstrip("/") for candidate in allowed_origins)


def extract_token_from_path(path: str) -> str:
    parsed = urlparse(path)
    params = parse_qs(parsed.query)
    values = params.get("token", [])
    return values[0] if values else ""


def is_token_valid(provided: str, expected: str) -> bool:
    if not expected:
        return False
    return hmac.compare_digest(provided.encode("utf-8"), expected.encode("utf-8"))


class BridgeWebSocketServer:
    """Binds strictly to 127.0.0.1 and validates Origin + token on handshake."""

    def __init__(self, settings: BridgeSettings) -> None:
        self._settings = settings
        self._clients: set[ServerConnection] = set()
        self._service = ScaleBridgeService(settings=settings, broadcast=self.broadcast)

    @property
    def service(self) -> ScaleBridgeService:
        return self._service

    async def broadcast(self, message: dict[str, Any]) -> None:
        if not self._clients:
            return
        serialized = json.dumps(message)
        stale: list[ServerConnection] = []
        for client in list(self._clients):
            try:
                await client.send(serialized)
            except Exception:
                stale.append(client)
        for client in stale:
            self._clients.discard(client)

    def _process_request(self, connection: ServerConnection, request: Request) -> Response | None:
        origin = request.headers.get("Origin")
        if not is_origin_allowed(origin, self._settings.allowed_origins):
            logger.warning("Rejected WebSocket connection from disallowed origin: %s", origin)
            return connection.respond(403, "Forbidden origin\n")

        token = extract_token_from_path(request.path)
        if not is_token_valid(token, self._settings.auth_token):
            logger.warning("Rejected WebSocket connection with invalid token.")
            return connection.respond(401, "Unauthorized bridge token\n")

        return None

    async def _handle_client(self, connection: ServerConnection) -> None:
        self._clients.add(connection)
        logger.info("ERP client connected to local bridge.")
        try:
            await connection.send(json.dumps(self._service.current_status_payload()))
            last = self._service.last_weight_payload()
            if last:
                await connection.send(json.dumps(last))

            async for raw_message in connection:
                if not isinstance(raw_message, str) or len(raw_message) > 4096:
                    await self._send_error(connection, "Invalid message payload.")
                    continue
                await self._dispatch_command(connection, raw_message)
        except Exception as exc:
            logger.debug("WebSocket client session ended: %s", exc)
        finally:
            self._clients.discard(connection)
            logger.info("ERP client disconnected from local bridge.")

    async def _dispatch_command(self, connection: ServerConnection, raw_message: str) -> None:
        try:
            data = json.loads(raw_message)
        except json.JSONDecodeError:
            await self._send_error(connection, "Malformed JSON command.")
            return

        if not isinstance(data, dict):
            await self._send_error(connection, "Command must be a JSON object.")
            return

        cmd = data.get("type")
        try:
            if cmd == "LIST_PORTS":
                ports_payload = await self._service.list_ports()
                await connection.send(json.dumps(ports_payload))
            elif cmd == "CONNECT":
                port = str(data.get("port", "")).strip()
                mode = str(data.get("mode", "hardware")).strip()
                if mode not in ("hardware", "simulator"):
                    raise ValueError("Invalid mode.")
                if mode == "hardware" and (not port or len(port) > 32):
                    raise ValueError("Valid COM port is required.")

                baud = int(data.get("baudRate", self._settings.default_baud_rate))
                if baud not in ALLOWED_BAUD_RATES:
                    raise ValueError(f"Unsupported baud rate: {baud}")

                data_bits = int(data.get("dataBits", self._settings.default_data_bits))
                if data_bits not in ALLOWED_DATA_BITS:
                    raise ValueError("Unsupported dataBits.")

                parity = str(data.get("parity", self._settings.default_parity)).upper()
                if parity not in ALLOWED_PARITY:
                    raise ValueError("Unsupported parity.")

                stop_bits = float(data.get("stopBits", self._settings.default_stop_bits))
                if stop_bits not in ALLOWED_STOP_BITS:
                    raise ValueError("Unsupported stopBits.")

                await self._service.connect(
                    port=port or "SIMULATOR",
                    baud_rate=baud,
                    data_bits=data_bits,
                    parity=parity,
                    stop_bits=stop_bits,
                    mode=mode,
                )
            elif cmd == "DISCONNECT":
                await self._service.disconnect()
            elif cmd == "RECONNECT":
                await self._service.reconnect()
            elif cmd == "ENABLE_DIAGNOSTICS":
                self._service.set_diagnostics(bool(data.get("enabled", False)))
            elif cmd == "SET_SIMULATOR_SCENARIO":
                scenario = str(data.get("scenario", "")).strip()
                self._service.set_simulator_scenario(scenario)
            else:
                await self._send_error(connection, f"Unsupported command: {cmd}")
        except ValueError as exc:
            await self._send_error(connection, str(exc))

    @staticmethod
    async def _send_error(connection: ServerConnection, message: str) -> None:
        await connection.send(json.dumps({"type": "BRIDGE_ERROR", "error": message}))

    async def run(self) -> None:
        async with serve(
            self._handle_client,
            self._settings.host,
            self._settings.port,
            process_request=self._process_request,
        ):
            logger.info(
                "Gorod scale bridge listening on ws://%s:%s",
                self._settings.host,
                self._settings.port,
            )
            await asyncio.Future()

