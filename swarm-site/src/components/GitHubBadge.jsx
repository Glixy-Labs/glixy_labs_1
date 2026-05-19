import { useEffect, useState } from 'react';
import { Github, Star, GitFork } from 'lucide-react';

const REPO = 'glixylabs/glixyswarm';

function formatCount(n) {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export function GitHubBadge() {
  const [stars, setStars]   = useState(null);
  const [forks, setForks]   = useState(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    let canceled = false;
    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (canceled) return;
        setStars(j.stargazers_count ?? 0);
        setForks(j.forks_count ?? 0);
      })
      .catch(() => !canceled && setError(true));
    return () => { canceled = true; };
  }, []);

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center divide-x divide-ink-800/15 overflow-hidden rounded-full border border-ink-800/20 bg-white/70 text-xs text-ink-200 transition-colors hover:bg-white"
    >
      <span className="flex items-center gap-2 px-3.5 py-2 font-medium">
        <Github className="h-3.5 w-3.5" />
        {REPO}
      </span>
      <span className="flex items-center gap-1.5 px-3 py-2">
        <Star className="h-3.5 w-3.5 text-accent-deep" />
        <span className="tabular-nums">{error ? '—' : formatCount(stars)}</span>
      </span>
      <span className="flex items-center gap-1.5 px-3 py-2">
        <GitFork className="h-3.5 w-3.5 text-accent-peach" />
        <span className="tabular-nums">{error ? '—' : formatCount(forks)}</span>
      </span>
    </a>
  );
}
