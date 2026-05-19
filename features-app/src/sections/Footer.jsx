export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 text-sm text-ink-400 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]">
            © 2026 Glixy Labs · Made in India 🇮🇳
          </p>
          <p className="text-[12px] text-ink-300">
            Companion concept inspired by{' '}
            <a className="underline-offset-2 hover:text-ink-500 hover:underline" href="https://github.com/ryanstephen/lil-agents" target="_blank" rel="noopener noreferrer">
              lil agents
            </a>{' '}
            (MIT, © Ryan Stephen). Original art &amp; code in this app are our own.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-5">
          <a href="https://glixylabs.com" className="transition-colors hover:text-ink-700">Home</a>
          <a href="https://lilagents.xyz" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink-700">Download</a>
          <a href="https://glixylabs.com/docs.html" className="transition-colors hover:text-ink-700">Docs</a>
          <a href="https://github.com/ryanstephen/lil-agents" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink-700">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
