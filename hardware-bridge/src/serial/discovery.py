"""COM port discovery with Bluetooth SPP detection (never hardcodes COM ports)."""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any

import serial.tools.list_ports


@dataclass(frozen=True)
class DiscoveredPort:
    port: str
    description: str
    hwid: str
    manufacturer: str
    is_bluetooth: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "port": self.port,
            "description": self.description,
            "hwid": self.hwid,
            "manufacturer": self.manufacturer,
            "isBluetooth": self.is_bluetooth,
        }


def is_bluetooth_port(description: str, hwid: str) -> bool:
    """Detect Windows Bluetooth SPP virtual COM ports."""
    desc_upper = (description or "").upper()
    hwid_upper = (hwid or "").upper()
    return (
        "BTHENUM" in hwid_upper
        or "BLUETOOTH" in desc_upper
        or "00001101-0000-1000-8000-00805F9B34FB" in hwid_upper
    )


def discover_serial_ports() -> list[DiscoveredPort]:
    """Return sorted COM ports, prioritizing Bluetooth SPP links first."""
    ports: list[DiscoveredPort] = []
    for info in serial.tools.list_ports.comports():
        bt = is_bluetooth_port(info.description or "", info.hwid or "")
        ports.append(
            DiscoveredPort(
                port=info.device,
                description=info.description or info.device,
                hwid=info.hwid or "",
                manufacturer=info.manufacturer or "",
                is_bluetooth=bt,
            )
        )

    ports.sort(key=lambda item: (not item.is_bluetooth, item.port))
    return ports

