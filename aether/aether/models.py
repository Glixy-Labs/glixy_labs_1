"""LLM provider adapters. OpenAI-compatible interface across Ollama, OpenAI, Anthropic, and a mock."""

from __future__ import annotations

import json
from typing import AsyncIterator, Optional

import httpx

from .config import CONFIG


class LLM:
    """Unified LLM interface. Streams chunks of text."""

    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        self.provider = provider or CONFIG.provider
        self.model = model or CONFIG.default_model

    async def chat(self, messages: list[dict], tools: Optional[list[dict]] = None,
                   temperature: float = 0.7) -> AsyncIterator[dict]:
        """Stream {type: 'text'|'tool_call'|'done', ...} events."""
        if self.provider == "ollama":
            async for ev in self._ollama(messages, tools, temperature):
                yield ev
        elif self.provider == "openai":
            async for ev in self._openai(messages, tools, temperature):
                yield ev
        elif self.provider == "anthropic":
            async for ev in self._anthropic(messages, tools, temperature):
                yield ev
        else:
            async for ev in self._mock(messages):
                yield ev

    async def _ollama(self, messages, tools, temperature):
        url = f"{CONFIG.ollama_url}/api/chat"
        body = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "options": {"temperature": temperature},
        }
        if tools:
            body["tools"] = tools
        try:
            async with httpx.AsyncClient(timeout=120) as cx:
                async with cx.stream("POST", url, json=body) as r:
                    if r.status_code != 200:
                        yield {"type": "error", "error": f"ollama {r.status_code}"}
                        async for ev in self._mock(messages):
                            yield ev
                        return
                    async for line in r.aiter_lines():
                        if not line:
                            continue
                        try:
                            data = json.loads(line)
                        except json.JSONDecodeError:
                            continue
                        msg = data.get("message", {})
                        content = msg.get("content")
                        if content:
                            yield {"type": "text", "delta": content}
                        for tc in msg.get("tool_calls", []) or []:
                            fn = tc.get("function", {})
                            yield {"type": "tool_call",
                                   "name": fn.get("name"),
                                   "arguments": fn.get("arguments") or {}}
                        if data.get("done"):
                            yield {"type": "done",
                                   "tokens": data.get("eval_count", 0),
                                   "duration_ms": int(data.get("total_duration", 0) / 1e6)}
                            return
        except (httpx.ConnectError, httpx.ReadTimeout):
            yield {"type": "error", "error": "ollama_unreachable"}
            async for ev in self._mock(messages):
                yield ev

    async def _openai(self, messages, tools, temperature):
        if not CONFIG.openai_api_key:
            yield {"type": "error", "error": "missing OPENAI_API_KEY"}
            async for ev in self._mock(messages):
                yield ev
            return
        body = {
            "model": self.model,
            "messages": messages,
            "stream": True,
            "temperature": temperature,
        }
        if tools:
            body["tools"] = tools
        headers = {"Authorization": f"Bearer {CONFIG.openai_api_key}"}
        async with httpx.AsyncClient(timeout=120) as cx:
            async with cx.stream("POST", f"{CONFIG.openai_base}/chat/completions",
                                 json=body, headers=headers) as r:
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    payload = line[6:].strip()
                    if payload == "[DONE]":
                        yield {"type": "done"}
                        return
                    try:
                        data = json.loads(payload)
                    except json.JSONDecodeError:
                        continue
                    delta = data.get("choices", [{}])[0].get("delta", {})
                    content = delta.get("content")
                    if content:
                        yield {"type": "text", "delta": content}
                    for tc in delta.get("tool_calls", []) or []:
                        fn = tc.get("function", {})
                        try:
                            args = json.loads(fn.get("arguments", "{}"))
                        except json.JSONDecodeError:
                            args = {}
                        yield {"type": "tool_call", "name": fn.get("name"), "arguments": args}

    async def _anthropic(self, messages, tools, temperature):
        if not CONFIG.anthropic_api_key:
            yield {"type": "error", "error": "missing ANTHROPIC_API_KEY"}
            async for ev in self._mock(messages):
                yield ev
            return
        # Anthropic requires a system message split out
        system = ""
        msgs = []
        for m in messages:
            if m.get("role") == "system":
                system = m.get("content", "")
            else:
                msgs.append(m)
        body = {
            "model": self.model if self.model.startswith("claude") else "claude-sonnet-4-6",
            "messages": msgs,
            "system": system,
            "max_tokens": 1024,
            "stream": True,
            "temperature": temperature,
        }
        headers = {
            "x-api-key": CONFIG.anthropic_api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        async with httpx.AsyncClient(timeout=120) as cx:
            async with cx.stream("POST", "https://api.anthropic.com/v1/messages",
                                 json=body, headers=headers) as r:
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    try:
                        data = json.loads(line[6:])
                    except json.JSONDecodeError:
                        continue
                    if data.get("type") == "content_block_delta":
                        d = data.get("delta", {})
                        if d.get("type") == "text_delta":
                            yield {"type": "text", "delta": d.get("text", "")}
                    elif data.get("type") == "message_stop":
                        yield {"type": "done"}
                        return

    async def _mock(self, messages):
        """Offline / fallback response when no model is reachable."""
        last = next((m for m in reversed(messages) if m.get("role") == "user"), {})
        prompt = last.get("content", "")[:200]
        reply = (
            "Aether is running in offline mode (no LLM reachable).\n\n"
            f"You said: \"{prompt}\"\n\n"
            "To use a real model:\n"
            "  • Install Ollama from https://ollama.com and run `ollama pull llama3`\n"
            "  • OR set OPENAI_API_KEY in your environment\n"
            "  • OR set ANTHROPIC_API_KEY in your environment\n"
            "Then restart Aether."
        )
        for chunk in reply.split(" "):
            yield {"type": "text", "delta": chunk + " "}
        yield {"type": "done"}
