# =====================================================
#  Build a single-file Windows EXE with PyInstaller
#  Run inside the aether-runtime folder.
# =====================================================

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".venv")) {
  python -m venv .venv
}
& ".venv\Scripts\python.exe" -m pip install --upgrade pip
& ".venv\Scripts\python.exe" -m pip install -r requirements.txt
& ".venv\Scripts\python.exe" -m pip install pyinstaller

& ".venv\Scripts\python.exe" -m PyInstaller `
  --name "GlixyAether" `
  --onefile `
  --windowed `
  --add-data "aether/web;aether/web" `
  --hidden-import uvicorn.logging `
  --hidden-import uvicorn.loops `
  --hidden-import uvicorn.loops.auto `
  --hidden-import uvicorn.protocols `
  --hidden-import uvicorn.protocols.http `
  --hidden-import uvicorn.protocols.http.auto `
  --hidden-import uvicorn.protocols.websockets `
  --hidden-import uvicorn.protocols.websockets.auto `
  --hidden-import uvicorn.lifespan `
  --hidden-import uvicorn.lifespan.on `
  -c `
  aether-launcher.py

Write-Host ""
Write-Host "Built: dist\GlixyAether.exe" -ForegroundColor Green
Write-Host "Run that to start the runtime + open the dashboard."
