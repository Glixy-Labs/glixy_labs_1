# Glixyswarm

Multi-agent orchestration desktop app — Tauri 2 + React + Rust.

## Stack

- **Frontend** — React 18, Tailwind CSS, Framer Motion, lucide-react
- **Backend** — Rust (Tokio + reqwest), SQLite via rusqlite
- **Shell** — Tauri 2 (system WebView, ~15–25 MB installer)

## Folder layout

```
glixyswarm-app/
├── src/                     # React frontend
│   ├── App.jsx
│   ├── components/          # Sidebar, AgentList, RunView, SettingsView
│   └── lib/bridge.js        # Tauri-or-browser invoker
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── main.rs          # Tauri commands + state
│   │   ├── store.rs         # SQLite agents/settings/runs
│   │   ├── agents.rs        # OpenAI / Anthropic / Ollama clients
│   │   └── runner.rs        # 4 flow patterns: seq / parallel / hierarchical / loop
│   ├── capabilities/
│   ├── icons/
│   ├── tauri.conf.json
│   └── Cargo.toml
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Develop

Prerequisites:

- Node 18+
- Rust 1.77+ (`rustup install stable`)
- macOS/Linux/Windows build tools per
  [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/)

```bash
cd glixyswarm-app
npm install
npm run tauri:dev          # launches the native window with hot reload
```

For UI-only iteration without the Rust backend:

```bash
npm run dev                # opens http://localhost:1420 in the browser
                           # bridge.js falls back to mock data
```

## Build installers

```bash
# generate icons once from a 1024x1024 source PNG
npx @tauri-apps/cli icon ./assets/glixyswarm-1024.png

# build for the host OS
npm run tauri:build
```

Output:

- macOS — `src-tauri/target/release/bundle/dmg/Glixyswarm_*.dmg`
- Windows — `src-tauri/target/release/bundle/nsis/Glixyswarm_*-setup.exe`
- Linux — `src-tauri/target/release/bundle/appimage/Glixyswarm_*.AppImage`

Cross-OS installers are best produced by GitHub Actions — see
[`.github/workflows/release.yml`](../.github/workflows/release.yml).

## What it does

- Define agents (name, system prompt, model, provider, allowed tools)
- Save to local SQLite — `~/.local/share/Glixyswarm/glixyswarm.db` or platform equivalent
- Run a swarm with one of four orchestration patterns
- Stream every step live in the dashboard
- API keys stored on-device, never transmitted except to your chosen model provider

## License

MIT © 2026 Glixy Labs. Product category inspired by OpenSwarm — this is our
independent implementation, not derived from their source.
