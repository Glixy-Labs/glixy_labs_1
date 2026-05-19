"""Aether FastAPI server. Endpoints:

POST /api/chat                   - send a message, stream response (SSE)
GET  /api/conversations          - list recent chats
GET  /api/conversations/{id}     - get messages
DELETE /api/conversations/{id}   - delete

POST /api/agents/run             - run a multi-agent crew (SSE)
GET  /api/runs                   - list recent runs

GET    /api/memory               - list memory items
POST   /api/memory               - save a memory item
DELETE /api/memory/{id}          - delete a memory item

GET  /api/tools                  - list available tools
POST /api/tools/{name}           - run a tool directly (admin/debug)

GET  /api/system                 - health, model, GPU info
GET  /                           - serve the bundled web dashboard
"""

from __future__ import annotations

import asyncio
import json
import time
import webbrowser
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import __version__
from . import agents as agentmod
from . import memory as mem
from . import tools as toolsmod
from .config import CONFIG


app = FastAPI(title="Glixy Aether", version=__version__)

# Allow the marketing site (same machine, any port) to call us.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)


@app.on_event("startup")
async def _startup():
    mem.init()


# -------- models --------

class ChatRequest(BaseModel):
    conversation_id: str | None = None
    message: str
    model: str | None = None
    provider: str | None = None
    use_tools: bool = True


class CrewRequest(BaseModel):
    task: str
    agents: list[dict] | None = None


class MemoryCreate(BaseModel):
    content: str
    type: str = "note"


# -------- helpers --------

def _sse(event: dict) -> str:
    return f"data: {json.dumps(event, ensure_ascii=False)}\n\n"


# -------- system --------

@app.get("/api/system")
async def system_info():
    info = {
        "name": "Glixy Aether",
        "version": __version__,
        "provider": CONFIG.provider,
        "model": CONFIG.default_model,
        "ollama_url": CONFIG.ollama_url,
        "data_dir": str(CONFIG.data_dir),
        "tools": [t["name"] for t in toolsmod.list_tools()],
        "openai_configured": bool(CONFIG.openai_api_key),
        "anthropic_configured": bool(CONFIG.anthropic_api_key),
        "uptime_started": _started,
    }
    return info


@app.get("/api/health")
async def health():
    return {"ok": True}


# -------- chat --------

@app.post("/api/chat")
async def chat(req: ChatRequest):
    conv_id = req.conversation_id
    if not conv_id:
        conv_id = mem.create_conversation(title=req.message[:50])["id"]
    mem.add_message(conv_id, "user", req.message)

    history = mem.get_conversation_messages(conv_id)
    messages = [{"role": m["role"], "content": m["content"]} for m in history
                if m["role"] in ("user", "assistant")]

    async def gen():
        accumulated = ""
        tool_calls = []
        yield _sse({"type": "start", "conversation_id": conv_id})
        async for ev in agentmod.chat_loop(messages, model=req.model,
                                           provider=req.provider,
                                           use_tools=req.use_tools):
            if ev["type"] == "text":
                accumulated += ev["delta"]
            elif ev["type"] == "tool_call_start":
                tool_calls.append({"name": ev["name"], "arguments": ev.get("arguments", {})})
            yield _sse(ev)
        mem.add_message(conv_id, "assistant", accumulated, tool_calls=tool_calls)
        yield _sse({"type": "saved", "conversation_id": conv_id})

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/api/conversations")
async def conversations_list():
    return {"items": mem.list_conversations()}


@app.get("/api/conversations/{cid}")
async def conversations_get(cid: str):
    return {"messages": mem.get_conversation_messages(cid)}


@app.delete("/api/conversations/{cid}")
async def conversations_delete(cid: str):
    mem.delete_conversation(cid)
    return {"ok": True}


# -------- agents / crew --------

@app.post("/api/agents/run")
async def agents_run(req: CrewRequest):
    async def gen():
        async for ev in agentmod.run_crew(req.task, req.agents):
            yield _sse(ev)
    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/api/runs")
async def runs_list():
    return {"items": mem.list_runs()}


# -------- memory --------

@app.get("/api/memory")
async def memory_list(type: str | None = None):
    return {"items": mem.list_memory(mtype=type)}


@app.post("/api/memory")
async def memory_create(item: MemoryCreate):
    return mem.save_memory(item.content, mtype=item.type)


@app.delete("/api/memory/{mid}")
async def memory_delete(mid: str):
    mem.delete_memory(mid)
    return {"ok": True}


# -------- tools --------

@app.get("/api/tools")
async def tools_list():
    return {"items": toolsmod.list_tools()}


@app.post("/api/tools/{name}")
async def tools_run(name: str, request: Request):
    args = await request.json() if request.headers.get("content-type", "").startswith("application/json") else {}
    return await toolsmod.run_tool(name, args)


# -------- web UI --------

WEB_DIR = Path(__file__).parent / "web"


@app.get("/", response_class=HTMLResponse)
async def root():
    index = WEB_DIR / "index.html"
    if not index.exists():
        return HTMLResponse(_FALLBACK_HTML, status_code=200)
    return FileResponse(index)


if WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")


_started = int(time.time())


_FALLBACK_HTML = """<!DOCTYPE html>
<html><head><title>Glixy Aether</title>
<style>body{font-family:system-ui;background:#fff8f1;color:#1a1410;margin:0;padding:60px;max-width:720px;margin:auto}
h1{font-family:Georgia,serif;font-size:42px}code{background:#fbf6f0;padding:2px 8px;border-radius:4px}
a{color:#ff6a1f}</style></head>
<body><h1>Glixy Aether is running ✦</h1>
<p>The runtime is live on <code>http://localhost:7777</code>.</p>
<p>Web UI is not bundled in this build. The API is available — try
<a href="/api/health">/api/health</a> or <a href="/api/system">/api/system</a>.</p>
<p>To use the dashboard, open <a href="https://glixylabs.com/dashboard.html">glixylabs.com/dashboard.html</a>
(it auto-detects the local runtime), or place your dashboard files in <code>aether/web/</code>.</p>
</body></html>"""


def main():
    import uvicorn

    if CONFIG.open_browser:
        async def open_later():
            await asyncio.sleep(1.0)
            try:
                webbrowser.open(f"http://{CONFIG.host}:{CONFIG.port}")
            except Exception:
                pass

        @app.on_event("startup")
        async def _open():
            asyncio.create_task(open_later())

    print(f"\n  ✦ Glixy Aether v{__version__}")
    print(f"  → http://{CONFIG.host}:{CONFIG.port}")
    print(f"  → provider: {CONFIG.provider}  model: {CONFIG.default_model}")
    print(f"  → data: {CONFIG.data_dir}\n")

    uvicorn.run(app, host=CONFIG.host, port=CONFIG.port, log_level="info")


if __name__ == "__main__":
    main()
