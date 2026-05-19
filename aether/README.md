# Glixy Aether

**Open-source AI assistant + multi-agent runtime.** Build, deploy and run AI
agents on your own GPUs. MIT-licensed, MCP-ready, runs on Llama, Mistral,
Qwen, OpenAI, Anthropic, or any OpenAI-compatible endpoint.

## Quick start (Windows)

One-line install (PowerShell):

```powershell
iwr https://glixylabs.com/install.ps1 | iex
```

Or manually:

1. Install Python 3.10+ from https://python.org/downloads
2. Download this folder
3. Double-click `start.bat`

The dashboard opens at http://localhost:7777.

## Quick start (macOS / Linux)

```bash
chmod +x start.sh
./start.sh
```

## Use a real model

Aether ships with a "mock" provider so it runs offline. To use a real LLM:

### Option 1 — Free local LLM (Ollama, recommended)

```bash
# install Ollama: https://ollama.com
ollama pull llama3
```

Aether will auto-detect Ollama on `http://localhost:11434`.

### Option 2 — OpenAI

```bash
# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."
$env:AETHER_PROVIDER = "openai"
$env:AETHER_MODEL = "gpt-4o"

# bash
export OPENAI_API_KEY="sk-..."
export AETHER_PROVIDER=openai
export AETHER_MODEL=gpt-4o
```

### Option 3 — Anthropic

```bash
export ANTHROPIC_API_KEY="..."
export AETHER_PROVIDER=anthropic
export AETHER_MODEL=claude-sonnet-4-6
```

## CLI

```bash
aether start                 # launch the server + dashboard
aether chat "hello"          # one-shot chat
aether memory list           # list saved memory
aether memory save --content "I prefer dark mode"
aether memory search --query "dark"
aether version
```

## API

All endpoints under `http://localhost:7777/api/...`:

| Method | Path | What |
|---|---|---|
| GET | `/api/health` | uptime |
| GET | `/api/system` | model, provider, tools, version |
| POST | `/api/chat` | streaming chat (SSE) |
| GET | `/api/conversations` | list chats |
| GET | `/api/conversations/{id}` | get messages |
| DELETE | `/api/conversations/{id}` | delete |
| POST | `/api/agents/run` | run a multi-agent crew (SSE) |
| GET | `/api/runs` | list past runs |
| GET | `/api/memory` | list memory items |
| POST | `/api/memory` | save a memory |
| DELETE | `/api/memory/{id}` | delete a memory |
| GET | `/api/tools` | list available tools |
| POST | `/api/tools/{name}` | run a tool directly |

## Built-in tools

- `web_fetch(url)` — fetch and clean a URL
- `web_search(query)` — DuckDuckGo HTML search
- `file_read(path)` — read a file (sandboxed to your home dir)
- `file_write(path, content)` — write a file
- `file_list(path)` — list a directory
- `shell_exec(command)` — run a shell command (with safety blocklist)
- `python_exec(code)` — run a Python snippet
- `memory_remember(content, type)` — save to memory
- `memory_recall(query)` — search memory

## Where data lives

- **Windows**: `%LOCALAPPDATA%\Aether\aether.db`
- **macOS**: `~/Library/Application Support/Aether/aether.db`
- **Linux**: `~/.local/share/aether/aether.db`

Delete that file to reset.

## Build a Windows installer

```powershell
.\build-windows.ps1                   # produces dist\GlixyAether.exe
# then open installer.iss in Inno Setup → produces GlixyAether-Setup.exe
```

## License

MIT — see LICENSE.
