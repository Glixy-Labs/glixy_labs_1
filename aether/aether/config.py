"""Aether configuration. Reads from env + ~/.aether/config.toml."""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


def _data_dir() -> Path:
    if sys.platform == "win32":
        base = os.environ.get("LOCALAPPDATA") or os.path.expanduser("~/AppData/Local")
        return Path(base) / "Aether"
    if sys.platform == "darwin":
        return Path(os.path.expanduser("~/Library/Application Support/Aether"))
    return Path(os.path.expanduser("~/.local/share/aether"))


@dataclass
class Config:
    host: str = "127.0.0.1"
    port: int = 7777
    open_browser: bool = True

    # LLM
    provider: str = "ollama"  # ollama | openai | anthropic | mock
    default_model: str = "llama3"
    ollama_url: str = "http://localhost:11434"
    openai_api_key: Optional[str] = None
    openai_base: str = "https://api.openai.com/v1"
    anthropic_api_key: Optional[str] = None

    # Storage
    data_dir: Path = field(default_factory=_data_dir)

    # Tools
    enable_shell: bool = True
    enable_files: bool = True
    enable_web: bool = True
    enable_memory: bool = True

    # Safety
    shell_blocklist: tuple = ("rm -rf /", "format", "del /f /s /q c:\\", "shutdown", "reboot")
    file_root: Optional[Path] = None  # if set, restrict file ops to this root

    @classmethod
    def load(cls) -> "Config":
        c = cls()
        c.data_dir.mkdir(parents=True, exist_ok=True)

        # env overrides
        c.host = os.environ.get("AETHER_HOST", c.host)
        c.port = int(os.environ.get("AETHER_PORT", c.port))
        c.provider = os.environ.get("AETHER_PROVIDER", c.provider)
        c.default_model = os.environ.get("AETHER_MODEL", c.default_model)
        c.ollama_url = os.environ.get("AETHER_OLLAMA_URL", c.ollama_url)
        c.openai_api_key = os.environ.get("OPENAI_API_KEY") or c.openai_api_key
        c.anthropic_api_key = os.environ.get("ANTHROPIC_API_KEY") or c.anthropic_api_key

        # auto-detect provider if user hasn't picked one
        if c.provider == "ollama" and c.openai_api_key and not os.environ.get("AETHER_PROVIDER"):
            # leave as ollama; user can switch in dashboard
            pass

        # file root for safety: default to the user's home
        c.file_root = Path(os.environ.get("AETHER_FILE_ROOT", str(Path.home())))

        return c


CONFIG = Config.load()
