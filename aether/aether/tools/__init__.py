"""Aether built-in tools. Each tool is a small async callable plus a JSON schema for the LLM."""

from . import web, files, shell, memory_tool, code

REGISTRY = {}
for mod in (web, files, shell, memory_tool, code):
    for t in mod.TOOLS:
        REGISTRY[t["name"]] = t


def list_tools() -> list[dict]:
    return [{"name": t["name"], "description": t["description"], "schema": t["schema"]}
            for t in REGISTRY.values()]


async def run_tool(name: str, arguments: dict) -> dict:
    if name not in REGISTRY:
        return {"error": f"unknown tool: {name}"}
    try:
        result = await REGISTRY[name]["fn"](**(arguments or {}))
        return {"ok": True, "result": result}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def openai_format() -> list[dict]:
    """Return tools in OpenAI / Ollama tool-calling format."""
    return [
        {
            "type": "function",
            "function": {
                "name": t["name"],
                "description": t["description"],
                "parameters": t["schema"],
            },
        }
        for t in REGISTRY.values()
    ]
