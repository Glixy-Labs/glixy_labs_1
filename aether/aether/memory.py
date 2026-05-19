"""SQLite-backed memory + conversation store."""

from __future__ import annotations

import json
import sqlite3
import time
import uuid
from contextlib import contextmanager
from typing import Optional

from .config import CONFIG

DB_PATH = CONFIG.data_dir / "aether.db"


SCHEMA = """
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  role TEXT,
  content TEXT,
  tool_calls TEXT,
  created_at INTEGER,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE TABLE IF NOT EXISTS memory (
  id TEXT PRIMARY KEY,
  type TEXT,
  content TEXT,
  metadata TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  task TEXT,
  agents TEXT,
  status TEXT,
  steps INTEGER,
  tokens INTEGER,
  duration_ms INTEGER,
  created_at INTEGER,
  trace TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_memory_type ON memory(type);
"""


@contextmanager
def conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    try:
        yield c
        c.commit()
    finally:
        c.close()


def init():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with conn() as c:
        c.executescript(SCHEMA)


def now() -> int:
    return int(time.time() * 1000)


# -------- conversations --------

def create_conversation(title: str = "New chat") -> dict:
    row = {"id": str(uuid.uuid4()), "title": title, "created_at": now(), "updated_at": now()}
    with conn() as c:
        c.execute(
            "INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?,?,?,?)",
            (row["id"], row["title"], row["created_at"], row["updated_at"]),
        )
    return row


def list_conversations(limit: int = 50) -> list[dict]:
    with conn() as c:
        rows = c.execute(
            "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]


def get_conversation_messages(conv_id: str) -> list[dict]:
    with conn() as c:
        rows = c.execute(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
            (conv_id,),
        ).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        if d.get("tool_calls"):
            try:
                d["tool_calls"] = json.loads(d["tool_calls"])
            except (json.JSONDecodeError, TypeError):
                d["tool_calls"] = []
        else:
            d["tool_calls"] = []
        out.append(d)
    return out


def add_message(conv_id: str, role: str, content: str,
                tool_calls: Optional[list] = None) -> dict:
    msg = {
        "id": str(uuid.uuid4()),
        "conversation_id": conv_id,
        "role": role,
        "content": content,
        "tool_calls": json.dumps(tool_calls or []),
        "created_at": now(),
    }
    with conn() as c:
        c.execute(
            "INSERT INTO messages (id, conversation_id, role, content, tool_calls, created_at) "
            "VALUES (?,?,?,?,?,?)",
            (msg["id"], msg["conversation_id"], msg["role"], msg["content"],
             msg["tool_calls"], msg["created_at"]),
        )
        c.execute("UPDATE conversations SET updated_at=? WHERE id=?", (now(), conv_id))
    return msg


def delete_conversation(conv_id: str):
    with conn() as c:
        c.execute("DELETE FROM messages WHERE conversation_id=?", (conv_id,))
        c.execute("DELETE FROM conversations WHERE id=?", (conv_id,))


# -------- memory items --------

def save_memory(content: str, mtype: str = "note", metadata: Optional[dict] = None) -> dict:
    row = {
        "id": str(uuid.uuid4()),
        "type": mtype,
        "content": content,
        "metadata": json.dumps(metadata or {}),
        "created_at": now(),
    }
    with conn() as c:
        c.execute(
            "INSERT INTO memory (id, type, content, metadata, created_at) VALUES (?,?,?,?,?)",
            (row["id"], row["type"], row["content"], row["metadata"], row["created_at"]),
        )
    return row


def list_memory(mtype: Optional[str] = None, limit: int = 100) -> list[dict]:
    with conn() as c:
        if mtype:
            rows = c.execute(
                "SELECT * FROM memory WHERE type=? ORDER BY created_at DESC LIMIT ?",
                (mtype, limit),
            ).fetchall()
        else:
            rows = c.execute(
                "SELECT * FROM memory ORDER BY created_at DESC LIMIT ?", (limit,)
            ).fetchall()
    return [dict(r) for r in rows]


def search_memory(query: str, limit: int = 10) -> list[dict]:
    """Simple keyword search. Future: replace with vector search."""
    q = f"%{query.lower()}%"
    with conn() as c:
        rows = c.execute(
            "SELECT * FROM memory WHERE LOWER(content) LIKE ? ORDER BY created_at DESC LIMIT ?",
            (q, limit),
        ).fetchall()
    return [dict(r) for r in rows]


def delete_memory(mid: str):
    with conn() as c:
        c.execute("DELETE FROM memory WHERE id=?", (mid,))


# -------- runs --------

def save_run(task: str, agents: list[str], status: str, steps: int,
             tokens: int, duration_ms: int, trace: list) -> dict:
    row = {
        "id": "r/" + uuid.uuid4().hex[:6],
        "task": task,
        "agents": json.dumps(agents),
        "status": status,
        "steps": steps,
        "tokens": tokens,
        "duration_ms": duration_ms,
        "created_at": now(),
        "trace": json.dumps(trace),
    }
    with conn() as c:
        c.execute(
            "INSERT INTO runs (id, task, agents, status, steps, tokens, duration_ms, created_at, trace) "
            "VALUES (?,?,?,?,?,?,?,?,?)",
            (row["id"], row["task"], row["agents"], row["status"], row["steps"],
             row["tokens"], row["duration_ms"], row["created_at"], row["trace"]),
        )
    return row


def list_runs(limit: int = 25) -> list[dict]:
    with conn() as c:
        rows = c.execute(
            "SELECT * FROM runs ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        d["agents"] = json.loads(d.get("agents") or "[]")
        out.append(d)
    return out
