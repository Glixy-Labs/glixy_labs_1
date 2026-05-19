"""Python execution tool — runs in a subprocess with a timeout."""

from __future__ import annotations

import asyncio
import sys
import textwrap


async def python_exec(code: str, timeout: int = 15) -> dict:
    """Run a Python snippet in a subprocess. Stdout / stderr captured."""
    src = textwrap.dedent(code)
    proc = await asyncio.create_subprocess_exec(
        sys.executable, "-c", src,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    try:
        out, err = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        proc.kill()
        return {"error": f"timeout after {timeout}s"}
    return {
        "code": proc.returncode,
        "stdout": (out or b"").decode("utf-8", errors="replace")[:8000],
        "stderr": (err or b"").decode("utf-8", errors="replace")[:4000],
    }


TOOLS = [
    {
        "name": "python_exec",
        "description": "Execute a Python snippet and return its stdout/stderr.",
        "schema": {
            "type": "object",
            "properties": {
                "code": {"type": "string"},
                "timeout": {"type": "integer", "default": 15},
            },
            "required": ["code"],
        },
        "fn": python_exec,
    },
]
