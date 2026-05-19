"""Shell tool: run shell commands with a blocklist for obviously dangerous ops."""

from __future__ import annotations

import asyncio

from ..config import CONFIG


async def shell_exec(command: str, cwd: str = ".", timeout: int = 30) -> dict:
    if not CONFIG.enable_shell:
        return {"error": "shell tool disabled"}
    low = command.lower()
    for blocked in CONFIG.shell_blocklist:
        if blocked in low:
            return {"error": f"blocked: command contains '{blocked}'"}

    proc = await asyncio.create_subprocess_shell(
        command,
        cwd=cwd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    try:
        out, err = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        proc.kill()
        return {"error": f"timeout after {timeout}s"}
    return {
        "command": command,
        "code": proc.returncode,
        "stdout": (out or b"").decode("utf-8", errors="replace")[:8000],
        "stderr": (err or b"").decode("utf-8", errors="replace")[:4000],
    }


TOOLS = [
    {
        "name": "shell_exec",
        "description": "Run a shell command and return stdout/stderr/exit code.",
        "schema": {
            "type": "object",
            "properties": {
                "command": {"type": "string"},
                "cwd": {"type": "string", "default": "."},
                "timeout": {"type": "integer", "default": 30},
            },
            "required": ["command"],
        },
        "fn": shell_exec,
    },
]
