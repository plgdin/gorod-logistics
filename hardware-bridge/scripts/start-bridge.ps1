$ErrorActionPreference = "Stop"
$BridgeRoot = Split-Path -Parent $PSScriptRoot
Push-Location $BridgeRoot
try {
    if (-not (Test-Path ".\config.json")) {
        Copy-Item ".\config.example.json" ".\config.json"
        Write-Host "Created config.json from config.example.json. Review allowed_origins and auth_token."
    }
    Write-Host "Starting Gorod Logistics Local Weighing Scale Bridge on 127.0.0.1..."
    python .\src\main.py --config .\config.json
} finally {
    Pop-Location
}

