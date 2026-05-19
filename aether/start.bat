@echo off
REM Glixy Aether — Windows launcher
setlocal

cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo [aether] Python is not installed.
  echo [aether] Get it from https://python.org/downloads (>= 3.10) and try again.
  pause
  exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
  echo [aether] First run — creating virtual env in .venv ...
  python -m venv .venv
  call .venv\Scripts\activate.bat
  echo [aether] Installing dependencies ...
  python -m pip install --upgrade pip >nul
  python -m pip install -r requirements.txt
) else (
  call .venv\Scripts\activate.bat
)

echo.
echo  =====================================================
echo   Glixy Aether — http://localhost:7777
echo   Press Ctrl+C to stop.
echo  =====================================================
echo.

python -m aether.cli start

endlocal
