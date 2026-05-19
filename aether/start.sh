#!/usr/bin/env bash
# Glixy Aether — macOS / Linux launcher
set -e

cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[aether] python3 is not installed. Install it (>= 3.10) and try again."
  exit 1
fi

if [ ! -d ".venv" ]; then
  echo "[aether] First run — creating virtual env in .venv ..."
  python3 -m venv .venv
  source .venv/bin/activate
  echo "[aether] Installing dependencies ..."
  python -m pip install --upgrade pip >/dev/null
  python -m pip install -r requirements.txt
else
  source .venv/bin/activate
fi

echo
echo "  ====================================================="
echo "   Glixy Aether — http://localhost:7777"
echo "   Press Ctrl+C to stop."
echo "  ====================================================="
echo

exec python -m aether.cli start
