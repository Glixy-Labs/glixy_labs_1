"""Memory tool: save and recall things across sessions."""

from __future__ import annotations

from .. import memory as mem


async def remember(content: str, type: str = "note") -> dict:
    row = mem.save_memory(content, mtype=type)
    return {"saved": row["id"], "type": row["type"]}


async def recall(query: str, max_results: int = 5) -> dict:
    rows = mem.search_memory(query, limit=max_results)
    return {"query": query, "matches": [
        {"type": r["type"], "content": r["content"]} for r in rows
    ]}


TOOLS = [
    {
        "name": "memory_remember",
        "description": "Save a fact, note, or observation to long-term memory.",
        "schema": {
            "type": "object",
            "properties": {
                "content": {"type": "string"},
                "type": {"type": "string",
                         "enum": ["note", "identity", "preference", "project", "event"],
                         "default": "note"},
            },
            "required": ["content"],
        },
        "fn": remember,
    },
    {
        "name": "memory_recall",
        "description": "Search long-term memory for matching items.",
        "schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "max_results": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
        "fn": recall,
    },
]
