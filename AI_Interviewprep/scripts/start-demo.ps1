# Start the working local demo (Node API + React frontend)
$Root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "load-env.ps1")
$Server = Join-Path $Root "server"
$Frontend = Join-Path $Root "frontend"

Write-Host "Starting API server on http://localhost:8080 ..."
$loadEnv = Join-Path $PSScriptRoot "load-env.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", ". '$loadEnv'; Set-Location '$Server'; node index.js" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting frontend on http://localhost:5173 ..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Frontend'; npm run dev" -WindowStyle Minimized

Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "App opened in browser!"
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  API:      http://localhost:8080"
Write-Host ""
Write-Host "Demo login: register any account, or use demo@interview.ai / password123"
