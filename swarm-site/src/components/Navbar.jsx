import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Download, Menu, X } from 'lucide-react';

const links = [
  { label: 'Features',  href: '#features'  },
  { label: 'Workflows', href: '#workflows' },
  { label: 'Setup',     href: '#setup'     },
  { label: 'Docs',      href: '#docs'      },
  { label: 'Download',  href: '#download'  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled
          ? 'border-b border-ink-800/40 bg-bg/85 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* Brand */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-ink-100"
        >
          <SwarmLogo />
          <span>
            Glixy<span className="text-accent-orange">swarm</span>
          </span>
        </a>

        {/* Center nav */}
        <nav className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center gap-7 text-sm text-ink-400 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="pointer-events-auto transition-colors hover:text-ink-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/glixylabs/glixyswarm"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-2 rounded-full bg-white/80 px-3.5 text-xs font-semibold text-ink-100 ring-1 ring-ink-800/40 transition-colors hover:bg-white sm:inline-flex"
          >
            <Github className="h-3.5 w-3.5" />
            Star
          </a>
          <a
            href="#download"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink-100 px-3.5 text-xs font-semibold text-bg transition-colors hover:bg-ink-200"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
            Download
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 ring-1 ring-ink-800/40 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden border-t border-ink-800/30 bg-bg/95 backdrop-blur-xl md:hidden"
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3 text-sm text-ink-200">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-white/60"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}

function SwarmLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <defs>
        <linearGradient id="swarm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#ff6a1f" />
          <stop offset="100%" stopColor="#ffb37a" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#1a1410" />
      <circle cx="16" cy="16" r="3.2" fill="url(#swarm-g)" />
      <circle cx="6"  cy="6"  r="2"  fill="#ff6a1f" />
      <circle cx="26" cy="6"  r="2"  fill="#ff8a3d" />
      <circle cx="6"  cy="26" r="2"  fill="#ffb37a" />
      <circle cx="26" cy="26" r="2"  fill="#ffeede" />
      <path d="M16 16 L6 6 M16 16 L26 6 M16 16 L6 26 M16 16 L26 26"
            stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
}
