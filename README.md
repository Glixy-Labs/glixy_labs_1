# Glixy Labs — Open Source

AI infrastructure for India and the world. GPU clusters, private LLMs, and cloud — all in one platform.

This is the public open-source mono-repo for **Glixy Labs**' products. Each top-level folder is a self-contained sub-project with its own README, license-compatible code, and build instructions.

→ Website: <https://glixylabs.com>
→ Company: <https://github.com/Glixy-Labs>

---

## Products

| Folder | What it is | Stack |
|---|---|---|
| [`aether/`](./aether) | **Glixy Aether** — AI assistant + agent runtime (CLI + HTTP) | Python, FastAPI, OpenAI/Anthropic/Ollama providers |
| [`swarm-app/`](./swarm-app) | **Glixy Swarm** — multi-agent desktop app | Tauri 2 + React + Vite |
| [`swarm-site/`](./swarm-site) | Marketing site for Swarm | React + Vite + Tailwind |
| [`features-app/`](./features-app) | Embeddable features showcase widget | React + Vite + Tailwind |

---

## Quick start

Each sub-project has its own setup. Common pattern:

```bash
cd swarm-app          # or swarm-site, features-app
npm install
npm run dev
```

For Aether:

```bash
cd aether
pip install -e .
aether serve
```

See each folder's `README.md` for details.

---

## License

Apache 2.0 — see [`LICENSE`](./LICENSE).

You may use, modify, and redistribute the code commercially or otherwise. The "Glixy", "Glixy Aether", and "Glixy Swarm" names and logos remain trademarks of Glixy Labs.

---

## Made in India 🇮🇳

Built by the Glixy Labs team. Reach out: contact@glixylabs.com
