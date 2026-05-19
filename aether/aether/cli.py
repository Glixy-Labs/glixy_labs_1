"""Aether CLI: `aether start`, `aether chat "..."`, `aether memory list`."""

from __future__ import annotations

import argparse
import asyncio
import sys

from . import __version__
from . import agents as agentmod
from . import memory as mem
from .config import CONFIG


def cmd_start(args):
    from .main import main
    if args.port:
        CONFIG.port = args.port
    if args.host:
        CONFIG.host = args.host
    if args.no_browser:
        CONFIG.open_browser = False
    main()


async def _run_chat(prompt: str, model: str | None):
    msgs = [{"role": "user", "content": prompt}]
    async for ev in agentmod.chat_loop(msgs, model=model):
        if ev["type"] == "text":
            sys.stdout.write(ev["delta"])
            sys.stdout.flush()
        elif ev["type"] == "tool_call_start":
            print(f"\n[tool] {ev['name']}({ev.get('arguments')})", flush=True)
        elif ev["type"] == "tool_call_result":
            print(f"[tool result] {str(ev['result'])[:200]}", flush=True)
        elif ev["type"] == "done":
            print(f"\n[done · {ev.get('duration_ms')}ms · {ev.get('iterations')} iters]")


def cmd_chat(args):
    mem.init()
    asyncio.run(_run_chat(args.prompt, args.model))


def cmd_memory(args):
    mem.init()
    if args.action == "list":
        for r in mem.list_memory(mtype=args.type):
            print(f"[{r['type']}] {r['content']}")
    elif args.action == "save":
        row = mem.save_memory(args.content, mtype=args.type or "note")
        print(f"saved {row['id']}")
    elif args.action == "search":
        for r in mem.search_memory(args.query):
            print(f"[{r['type']}] {r['content']}")


def cmd_version(args):
    print(f"Glixy Aether {__version__}")


def main():
    p = argparse.ArgumentParser(prog="aether",
                                description="Glixy Aether — open-source AI assistant + agents")
    sub = p.add_subparsers(dest="cmd")

    s = sub.add_parser("start", help="Start the Aether server (web UI + API)")
    s.add_argument("--host")
    s.add_argument("--port", type=int)
    s.add_argument("--no-browser", action="store_true")
    s.set_defaults(fn=cmd_start)

    s = sub.add_parser("chat", help="One-shot chat from the CLI")
    s.add_argument("prompt")
    s.add_argument("--model")
    s.set_defaults(fn=cmd_chat)

    s = sub.add_parser("memory", help="Inspect long-term memory")
    s.add_argument("action", choices=["list", "save", "search"])
    s.add_argument("--type")
    s.add_argument("--content")
    s.add_argument("--query")
    s.set_defaults(fn=cmd_memory)

    s = sub.add_parser("version")
    s.set_defaults(fn=cmd_version)

    args = p.parse_args()
    if not getattr(args, "fn", None):
        p.print_help()
        return
    args.fn(args)


if __name__ == "__main__":
    main()
