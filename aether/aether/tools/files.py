"""File tools: list, read, write — sandboxed to the configured file_root."""

from __future__ import annotations

from pathlib import Path

from ..config import CONFIG


def _safe(path: str) -> Path:
    p = Path(path).expanduser().resolve()
    root = CONFIG.file_root.resolve() if CONFIG.file_root else None
    if root and not str(p).startswith(str(root)):
        raise ValueError(f"path outside sandbox: {p} (root: {root})")
    return p


async def read_file(path: str, max_bytes: int = 100_000) -> dict:
    if not CONFIG.enable_files:
        return {"error": "files tool disabled"}
    p = _safe(path)
    if not p.exists():
        return {"error": f"not found: {p}"}
    if not p.is_file():
        return {"error": f"not a file: {p}"}
    data = p.read_bytes()[:max_bytes]
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        text = data.decode("utf-8", errors="replace")
    return {"path": str(p), "size": p.stat().st_size, "text": text}


async def write_file(path: str, content: str) -> dict:
    if not CONFIG.enable_files:
        return {"error": "files tool disabled"}
    p = _safe(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return {"path": str(p), "bytes": len(content.encode("utf-8"))}


async def list_dir(path: str = ".") -> dict:
    if not CONFIG.enable_files:
        return {"error": "files tool disabled"}
    p = _safe(path)
    if not p.exists():
        return {"error": f"not found: {p}"}
    items = []
    for child in sorted(p.iterdir()):
        items.append({
            "name": child.name,
            "kind": "dir" if child.is_dir() else "file",
            "size": child.stat().st_size if child.is_file() else None,
        })
    return {"path": str(p), "items": items[:200]}


TOOLS = [
    {
        "name": "file_read",
        "description": "Read a text file from disk.",
        "schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"],
        },
        "fn": read_file,
    },
    {
        "name": "file_write",
        "description": "Write text content to a file (creates parent dirs).",
        "schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"},
            },
            "required": ["path", "content"],
        },
        "fn": write_file,
    },
    {
        "name": "file_list",
        "description": "List entries in a directory.",
        "schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "default": "."}},
        },
        "fn": list_dir,
    },
]
