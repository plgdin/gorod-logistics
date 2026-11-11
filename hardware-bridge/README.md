# Gorod Logistics — Local Bluetooth/Serial Weighing Scale Bridge

Local Windows 11 service connecting the Casio electronic weighing indicator (via HC-05 Bluetooth Classic SPP virtual COM port) to the Gorod Logistics CBW ERP web application over an authenticated localhost-only WebSocket (`ws://127.0.0.1:8765`).

## 1. Prerequisites
- Windows 11 workstation paired with the HC-05 module (default pairing PIN tested: `1234`)
- Python 3.11+ (`python --version`)
- Dependencies:
  ```powershell
  cd hardware-bridge
  pip install -r requirements.txt
  ```

## 2. Phase 1 Hardware Diagnostics (Verify Scale Protocol First)
Run the passive read-only diagnostics CLI before connecting the ERP:
```powershell
python src/diagnostics/cli.py list
python src/diagnostics/cli.py monitor --port COM6 --baud 9600 --duration 15 --log logs/diag.log
```
If the port opens cleanly but **no bytes arrive after 5s**:
1. Confirm whether the Casio indicator is in **Continuous TX**, **Stable Print**, or **Manual Print** mode.
2. Check baud rate (`2400`, `4800`, `9600`, `19200`) and framing (`8N1` vs `7E1`).
3. Verify TX/RX wiring and **RS232-to-TTL level conversion** (Casio RS232 uses ±12V logic; HC-05 UART requires 3.3V/5V TTL via a MAX3232 converter — connecting RS232 directly to HC-05 prevents data or damages the module).
4. Try the outgoing vs incoming Bluetooth COM port shown in `cli.py list` and Windows Bluetooth Settings -> More Bluetooth options -> COM Ports.

## 3. Configuration
Copy `config.example.json` to `config.json`:
- `host`: Must remain `127.0.0.1` (localhost-only).
- `port`: WebSocket port (default `8765`).
- `auth_token`: Must match `VITE_SCALE_BRIDGE_TOKEN` in the frontend `.env` (or entered in the UI device settings).
- `allowed_origins`: Include your Vercel production URL (e.g. `https://your-app.vercel.app`) and local dev origin (`http://localhost:5173`).

## 4. Startup & Shutdown
Start manually:
```powershell
.\scripts\start-bridge.ps1
```
Stop:
```powershell
.\scripts\stop-bridge.ps1
```
Install automatic Windows logon startup:
```powershell
.\scripts\install-startup.ps1
```

## 5. Logs & Testing
- Rotating logs: `hardware-bridge/logs/bridge.log`
- Unit tests:
  ```powershell
  python -m unittest discover -s tests -v
  ```

