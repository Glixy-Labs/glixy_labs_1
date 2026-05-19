"""Agent loop and multi-agent crew orchestrator."""

from __future__ import annotations

import time
from typing import AsyncIterator, Optional

from . import memory as mem
from . import tools
from .models import LLM


SYSTEM_PROMPT = """You are Aether, an open-source private AI assistant built by Glixy Labs.
You can call tools to do things in the real world. Be concise.
When the user asks you to do something, prefer calling a tool over guessing.
Always cite results when you fetch external content.

Available tools (call by name, with JSON arguments):
{tool_summary}
"""


def _tool_summary() -> str:
    lines = []
    for t in tools.list_tools():
        lines.append(f"- {t['name']}: {t['description']}")
    return "\n".join(lines)


async def chat_loop(
    messages: list[dict],
    model: Optional[str] = None,
    provider: Optional[str] = None,
    use_tools: bool = True,
    max_iterations: int = 6,
) -> AsyncIterator[dict]:
    """Run a single-agent ReAct-style loop. Streams events to caller."""
    llm = LLM(provider=provider, model=model)
    sys_msg = {"role": "system", "content": SYSTEM_PROMPT.format(tool_summary=_tool_summary())}
    convo = [sys_msg] + list(messages)
    tool_specs = tools.openai_format() if use_tools else None

    started = time.time()
    total_tokens = 0

    for step in range(max_iterations):
        accumulated_text = ""
        pending_tool_calls = []

        async for ev in llm.chat(convo, tools=tool_specs):
            if ev["type"] == "text":
                accumulated_text += ev["delta"]
                yield {"type": "text", "delta": ev["delta"], "step": step}
            elif ev["type"] == "tool_call":
                pending_tool_calls.append(ev)
                yield {"type": "tool_call_start", "name": ev["name"],
                       "arguments": ev["arguments"], "step": step}
            elif ev["type"] == "done":
                total_tokens += ev.get("tokens", 0)
            elif ev["type"] == "error":
                yield ev

        # If the model emitted tool calls, run them and feed results back.
        if pending_tool_calls:
            convo.append({"role": "assistant", "content": accumulated_text or "",
                          "tool_calls": pending_tool_calls})
            for tc in pending_tool_calls:
                result = await tools.run_tool(tc["name"], tc.get("arguments", {}))
                yield {"type": "tool_call_result", "name": tc["name"],
                       "result": result, "step": step}
                convo.append({
                    "role": "tool",
                    "name": tc["name"],
                    "content": str(result)[:4000],
                })
            continue  # next iteration: model sees tool results

        # No tool calls and we have text — we're done.
        convo.append({"role": "assistant", "content": accumulated_text})
        yield {"type": "done",
               "duration_ms": int((time.time() - started) * 1000),
               "tokens": total_tokens,
               "iterations": step + 1}
        return

    yield {"type": "done",
           "duration_ms": int((time.time() - started) * 1000),
           "tokens": total_tokens,
           "iterations": max_iterations,
           "warning": "max_iterations_reached"}


# -------- multi-agent crew --------

DEFAULT_CREW = [
    {"name": "researcher", "role": "Search the web and read sources.",
     "model": None},
    {"name": "writer", "role": "Synthesize findings into a clear answer with citations.",
     "model": None},
]


async def run_crew(task: str, agents: Optional[list[dict]] = None) -> AsyncIterator[dict]:
    """Run a tiny plan→delegate crew. Yields trace events; persists final run."""
    crew = agents or DEFAULT_CREW
    started = time.time()
    trace: list[dict] = []
    total_tokens = 0
    steps = 0

    yield {"type": "crew_start", "task": task, "agents": [a["name"] for a in crew]}

    intermediate: list[str] = []
    for agent in crew:
        steps += 1
        yield {"type": "agent_start", "agent": agent["name"], "step": steps}

        prompt = (
            f"You are the '{agent['name']}' agent. Role: {agent['role']}\n\n"
            f"Original task: {task}\n\n"
        )
        if intermediate:
            prompt += "Findings so far:\n" + "\n---\n".join(intermediate)

        agent_messages = [{"role": "user", "content": prompt}]
        text = ""
        async for ev in chat_loop(agent_messages, model=agent.get("model")):
            if ev["type"] == "text":
                text += ev["delta"]
                yield {"type": "agent_delta", "agent": agent["name"],
                       "delta": ev["delta"]}
            elif ev["type"] == "tool_call_start":
                trace.append({"agent": agent["name"], "tool": ev["name"],
                              "args": ev.get("arguments", {})})
                yield {**ev, "agent": agent["name"]}
            elif ev["type"] == "tool_call_result":
                yield {**ev, "agent": agent["name"]}
            elif ev["type"] == "done":
                total_tokens += ev.get("tokens", 0)

        intermediate.append(f"[{agent['name']}]\n{text}")
        yield {"type": "agent_done", "agent": agent["name"], "step": steps}

    duration_ms = int((time.time() - started) * 1000)
    final = "\n\n".join(intermediate)

    run = mem.save_run(
        task=task,
        agents=[a["name"] for a in crew],
        status="ok",
        steps=steps,
        tokens=total_tokens,
        duration_ms=duration_ms,
        trace=trace,
    )
    yield {"type": "crew_done", "run_id": run["id"], "duration_ms": duration_ms,
           "tokens": total_tokens, "final": final}
