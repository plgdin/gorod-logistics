"""Entry point for the Gorod Logistics Windows local Bluetooth/Serial scale bridge."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.config.settings import load_settings
from src.websocket.server import BridgeWebSocketServer


def configure_logging(level: str, log_file: str) -> None:
    root = Path(__file__).resolve().parents[1]
    target = Path(log_file)
    if not target.is_absolute():
        target = root / target
    target.parent.mkdir(parents=True, exist_ok=True)

    handlers: list[logging.Handler] = [
        logging.StreamHandler(sys.stdout),
        RotatingFileHandler(target, maxBytes=2 * 1024 * 1024, backupCount=3, encoding="utf-8"),
    ]
    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        handlers=handlers,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Gorod Logistics Local Weighing Scale Bridge")
    parser.add_argument("--config", default=None, help="Path to config.json")
    args = parser.parse_args()

    settings = load_settings(args.config)
    configure_logging(settings.log_level, settings.log_file)

    server = BridgeWebSocketServer(settings)
    try:
        asyncio.run(server.run())
    except KeyboardInterrupt:
        logging.getLogger("gorod.bridge").info("Bridge shutdown requested by user.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

