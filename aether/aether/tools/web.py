"""Web tools: fetch a URL, search the web."""

from __future__ import annotations

import re
from urllib.parse import quote_plus

import httpx

UA = "Mozilla/5.0 AetherAgent/0.4 (+https://glixylabs.com/aether)"


async def fetch(url: str, max_chars: int = 6000) -> dict:
    """Fetch a URL and return cleaned text."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    async with httpx.AsyncClient(timeout=20, follow_redirects=True,
                                 headers={"User-Agent": UA}) as cx:
        r = await cx.get(url)
    text = re.sub(r"<script[^>]*>.*?</script>", " ", r.text, flags=re.S | re.I)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return {"url": url, "status": r.status_code, "text": text[:max_chars]}


async def search(query: str, max_results: int = 5) -> dict:
    """DuckDuckGo HTML-only search (no API key needed)."""
    url = f"https://duckduckgo.com/html/?q={quote_plus(query)}"
    async with httpx.AsyncClient(timeout=20, follow_redirects=True,
                                 headers={"User-Agent": UA}) as cx:
        r = await cx.get(url)
    results = re.findall(
        r'<a class="result__a" href="([^"]+)"[^>]*>(.*?)</a>',
        r.text, flags=re.S,
    )
    snippets = re.findall(
        r'<a class="result__snippet"[^>]*>(.*?)</a>',
        r.text, flags=re.S,
    )
    out = []
    for i, (href, title) in enumerate(results[:max_results]):
        title_clean = re.sub(r"<[^>]+>", "", title).strip()
        snip = re.sub(r"<[^>]+>", "", snippets[i]).strip() if i < len(snippets) else ""
        out.append({"title": title_clean, "url": href, "snippet": snip})
    return {"query": query, "results": out}


TOOLS = [
    {
        "name": "web_fetch",
        "description": "Fetch a URL and return the cleaned text content.",
        "schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "URL to fetch"},
            },
            "required": ["url"],
        },
        "fn": fetch,
    },
    {
        "name": "web_search",
        "description": "Search the web (DuckDuckGo) for a query.",
        "schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "max_results": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
        "fn": search,
    },
]
