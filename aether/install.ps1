# =====================================================
#  Glixy Aether — Windows one-line installer
#  Usage:  iwr https://glixylabs.com/install.ps1 | iex
# =====================================================

$ErrorActionPreference = "Stop"

$AETHER_HOME = Join-Path $env:LOCALAPPDATA "Aether"
$REPO_ZIP    = "https://github.com/glixylabs/aether/archive/refs/heads/main.zip"
$LOCAL_ZIP   = "https://glixylabs.com/aether-runtime.zip"

Write-Host ""
Write-Host "  =====================================================" -ForegroundColor Yellow
Write-Host "   Glixy Aether — installer" -ForegroundColor Yellow
Write-Host "  =====================================================" -ForegroundColor Yellow
Write-Host ""

# 1. Python check
function Test-Python {
  try {
    $v = & python --version 2>&1
    if ($v -match "Python 3\.(1[0-9]|[2-9][0-9])") { return $true }
  } catch {}
  return $false
}

if (-not (Test-Python)) {
  Write-Host "[aether] Python 3.10+ not found." -ForegroundColor Red
  Write-Host "[aether] Please install Python from https://python.org/downloads"
  Write-Host "[aether] Make sure to tick 'Add Python to PATH' during install."
  Write-Host ""
  $r = Read-Host "Open the Python download page now? (y/N)"
  if ($r -eq "y") { Start-Process "https://python.org/downloads" }
  exit 1
}
Write-Host "[aether] Python found: $(python --version)"

# 2. Create install dir
if (Test-Path $AETHER_HOME) {
  Write-Host "[aether] Updating existing install at $AETHER_HOME"
} else {
  New-Item -ItemType Directory -Path $AETHER_HOME | Out-Null
  Write-Host "[aether] Installing to $AETHER_HOME"
}

# 3. Download package
$tmp = Join-Path $env:TEMP "aether-install.zip"
Write-Host "[aether] Downloading runtime ..."
try {
  Invoke-WebRequest -Uri $LOCAL_ZIP -OutFile $tmp -UseBasicParsing
} catch {
  Write-Host "[aether] Local zip not found, trying GitHub ..." -ForegroundColor Yellow
  Invoke-WebRequest -Uri $REPO_ZIP -OutFile $tmp -UseBasicParsing
}

# 4. Extract
Write-Host "[aether] Extracting ..."
Expand-Archive -Path $tmp -DestinationPath $AETHER_HOME -Force
Remove-Item $tmp -Force

# 5. Locate the extracted folder (may be aether-runtime/ or aether-main/)
$extracted = Get-ChildItem -Path $AETHER_HOME -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName "requirements.txt") } |
  Select-Object -First 1
if (-not $extracted) {
  Write-Host "[aether] Extracted layout looks wrong — check $AETHER_HOME" -ForegroundColor Red
  exit 1
}
$RT = $extracted.FullName

# 6. Create venv + install deps
Set-Location $RT
if (-not (Test-Path ".venv")) {
  Write-Host "[aether] Creating virtual env ..."
  python -m venv .venv
}
Write-Host "[aether] Installing dependencies ..."
& "$RT\.venv\Scripts\python.exe" -m pip install --upgrade pip 2>&1 | Out-Null
& "$RT\.venv\Scripts\python.exe" -m pip install -r requirements.txt

# 7. Start Menu shortcut
$start = [Environment]::GetFolderPath("Programs")
$lnk = Join-Path $start "Glixy Aether.lnk"
$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($lnk)
$shortcut.TargetPath  = Join-Path $RT "start.bat"
$shortcut.WorkingDirectory = $RT
$shortcut.IconLocation = "shell32.dll,167"
$shortcut.Description = "Open Glixy Aether (AI assistant + agents)"
$shortcut.Save()
Write-Host "[aether] Created Start Menu shortcut: $lnk"

# 8. Desktop shortcut (optional)
$desktop = [Environment]::GetFolderPath("Desktop")
$dlnk = Join-Path $desktop "Glixy Aether.lnk"
$shortcut = $wsh.CreateShortcut($dlnk)
$shortcut.TargetPath  = Join-Path $RT "start.bat"
$shortcut.WorkingDirectory = $RT
$shortcut.IconLocation = "shell32.dll,167"
$shortcut.Description = "Open Glixy Aether"
$shortcut.Save()

# 9. PATH (user-level) — add CLI
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$venvBin = Join-Path $RT ".venv\Scripts"
if ($userPath -notlike "*$venvBin*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$venvBin", "User")
  Write-Host "[aether] Added $venvBin to user PATH"
}

Write-Host ""
Write-Host "  =====================================================" -ForegroundColor Green
Write-Host "   ✓ Installed!" -ForegroundColor Green
Write-Host "  =====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Start it with:        " -NoNewline; Write-Host "Start Menu → Glixy Aether" -ForegroundColor Yellow
Write-Host "  Or from any terminal: " -NoNewline; Write-Host "aether start" -ForegroundColor Yellow
Write-Host "  Dashboard URL:        " -NoNewline; Write-Host "http://localhost:7777" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Tip: install Ollama (https://ollama.com) for free local LLMs:"
Write-Host "       ollama pull llama3"
Write-Host ""

# 10. Auto-launch?
$r = Read-Host "Launch Glixy Aether now? (Y/n)"
if ($r -ne "n") {
  Start-Process (Join-Path $RT "start.bat")
}
