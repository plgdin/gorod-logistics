"""Tests for WebSocket origin allowlist, token validation, and bridge service."""

import asyncio
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.config.settings import BridgeSettings
from src.services.bridge_service import ScaleBridgeService
from src.websocket.server import extract_token_from_path, is_origin_allowed, is_token_valid


class WebSocketSecurityTests(unittest.TestCase):
    def test_origin_validation(self) -> None:
        allowed = ("http://localhost:5173", "https://gorodlogistics.com")
        self.assertTrue(is_origin_allowed("http://localhost:5173", allowed))
        self.assertTrue(is_origin_allowed("https://gorodlogistics.com/", allowed))
        self.assertFalse(is_origin_allowed("https://evil.example.com", allowed))
        self.assertFalse(is_origin_allowed(None, allowed))

    def test_token_extraction_and_validation(self) -> None:
        token = extract_token_from_path("/?token=secret-123")
        self.assertEqual(token, "secret-123")
        self.assertTrue(is_token_valid(token, "secret-123"))
        self.assertFalse(is_token_valid("wrong", "secret-123"))
        self.assertFalse(is_token_valid("", ""))


class BridgeSimulatorServiceTests(unittest.TestCase):
    def test_simulator_emits_status_and_weight_updates(self) -> None:
        async def run_scenario() -> list[dict]:
            events: list[dict] = []

            async def capture(msg: dict) -> None:
                events.append(msg)

            service = ScaleBridgeService(settings=BridgeSettings(), broadcast=capture)
            await service.connect(port="SIMULATOR", mode="simulator")
            service.set_simulator_scenario("decimal_24_6")
            await asyncio.sleep(0.7)
            await service.disconnect()
            return events

        events = asyncio.run(run_scenario())
        statuses = [e["status"] for e in events if e.get("type") == "CONNECTION_STATUS"]
        weights = [e for e in events if e.get("type") == "WEIGHT_UPDATE"]

        self.assertIn("CONNECTED", statuses)
        self.assertIn("DISCONNECTED", statuses)
        self.assertGreaterEqual(len(weights), 1)
        self.assertEqual(weights[-1]["weight"], 24.6)
        self.assertEqual(weights[-1]["stabilitySource"], "DEVICE")
        self.assertEqual(weights[-1]["mode"], "simulator")


if __name__ == "__main__":
    unittest.main()

