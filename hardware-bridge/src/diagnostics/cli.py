"""Phase 1 Independent Serial Diagnostics CLI (passive read-only inspection)."""

from __future__ import annotations

import argparse
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import serial

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from src.parser.weight_parser import SerialPacketBuffer, parse_weight_packet
from src.serial.discovery import discover_serial_ports


def format_hex(data: bytes) -> str:
    return " ".join(f"{byte:02X}" for byte in data)


def cmd_list() -> int:
    ports = discover_serial_ports()
    if not ports:
        print("No serial COM ports detected.")
        return 0
    print(f"Found {len(ports)} serial port(s):")
    for item in ports:
        bt_label = "[BLUETOOTH SPP]" if item.is_bluetooth else "[SERIAL]"
        print(f"  {item.port:<8} {bt_label:<16} {item.description} ({item.hwid})")
    return 0


def cmd_monitor(
    port: str,
    baud: int,
    bytesize: int,
    parity: str,
    stopbits: float,
    duration: float,
    log_file: str | None,
) -> int:
    buffer = SerialPacketBuffer()
    total_bytes = 0
    log_handle = open(log_file, "a", encoding="utf-8") if log_file else None

    def log_line(message: str) -> None:
        print(message, flush=True)
        if log_handle:
            log_handle.write(message + "\n")
            log_handle.flush()

    log_line(
        f"[{datetime.now(timezone.utc).isoformat()}] Opening {port} @ {baud} {bytesize}{parity}{stopbits} (passive read-only, no TX commands sent)"
    )

    try:
        with serial.Serial(
            port=port,
            baudrate=baud,
            bytesize=bytesize,
            parity=parity,
            stopbits=stopbits,
            timeout=0.5,
        ) as ser:
            log_line(f"[{datetime.now(timezone.utc).isoformat()}] Port opened cleanly.")
            start = time.monotonic()
            last_data = start
            warned_silent = False

            while True:
                if duration > 0 and (time.monotonic() - start) >= duration:
                    break
                waiting = ser.in_waiting
                chunk = ser.read(waiting if waiting > 0 else 1)
                now_iso = datetime.now(timezone.utc).isoformat()

                if chunk:
                    last_data = time.monotonic()
                    warned_silent = False
                    total_bytes += len(chunk)
                    ascii_repr = chunk.decode("ascii", errors="replace").replace("\r", "\\r").replace("\n", "\\n")
                    log_line(
                        f"[{now_iso}] RX {len(chunk)}B (total={total_bytes}B) | ASCII='{ascii_repr}' | HEX={format_hex(chunk)}"
                    )
                    for line in buffer.feed(chunk):
                        parsed = parse_weight_packet(line)
                        log_line(
                            f"  -> PACKET='{line}' | valid={parsed.valid} weight_kg={parsed.weight_kg} "
                            f"device_stable={parsed.device_stable} overload={parsed.overload} err={parsed.error}"
                        )
                elif not warned_silent and (time.monotonic() - last_data) >= 5.0:
                    warned_silent = True
                    log_line(
                        f"[{now_iso}] NO DATA RECEIVED after 5s. Check indicator continuous-TX/print mode, baud rate, or RS232-to-TTL converter."
                    )
    except KeyboardInterrupt:
        log_line("Stopped by user.")
    except serial.SerialException as exc:
        log_line(f"[SERIAL ERROR] {exc}")
        return 1
    finally:
        log_line(f"[{datetime.now(timezone.utc).isoformat()}] Port closed. Total bytes received: {total_bytes}")
        if log_handle:
            log_handle.close()

    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Gorod Logistics Serial / Bluetooth Diagnostics Tool")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="Discover COM ports and highlight Bluetooth SPP links")

    mon = sub.add_parser("monitor", help="Open serial port passively and inspect raw bytes, ASCII, and hex")
    mon.add_argument("--port", required=True, help="COM port name (e.g. COM6)")
    mon.add_argument("--baud", type=int, default=9600, help="Baud rate (default: 9600)")
    mon.add_argument("--bytesize", type=int, choices=(7, 8), default=8, help="Data bits (default: 8)")
    mon.add_argument("--parity", choices=("N", "E", "O"), default="N", help="Parity (default: N)")
    mon.add_argument("--stopbits", type=float, choices=(1, 1.5, 2), default=1, help="Stop bits (default: 1)")
    mon.add_argument("--duration", type=float, default=0, help="Seconds to monitor (0 = until Ctrl+C)")
    mon.add_argument("--log", default=None, help="Optional file path to save diagnostic output")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if args.command == "list":
        return cmd_list()
    return cmd_monitor(
        port=args.port,
        baud=args.baud,
        bytesize=args.bytesize,
        parity=args.parity,
        stopbits=args.stopbits,
        duration=args.duration,
        log_file=args.log,
    )


if __name__ == "__main__":
    raise SystemExit(main())

