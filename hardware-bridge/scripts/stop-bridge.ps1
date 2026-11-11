$ErrorActionPreference = "Stop"
Get-CimInstance Win32_Process |
    Where-Object { $_.CommandLine -like "*hardware-bridge*src*main.py*" } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force
        Write-Host "Stopped bridge process PID $($_.ProcessId)"
    }

