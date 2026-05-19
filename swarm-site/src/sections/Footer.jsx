export function Footer() {
  return (
    <footer className="border-t border-ink-800/15 bg-white/70 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold tracking-tight text-ink-100">
            <span
              aria-hidden="true"
              className="h-5 w-5 rounded-md"
              style={{ background: 'linear-gradient(135deg, #ff6a1f, #ffb37a)' }}
            />
            Glixy<span className="text-accent-orange">swarm</span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-500">
            Open-source multi-agent orchestration for your desktop. Made with care by
            Glixy Labs in India.
          </p>
          <p className="mt-3 text-[11px] text-ink-500">
            Product category inspired by{' '}
            <a className="underline-offset-2 hover:text-ink-100 hover:underline" href="https://github.com/openswarm-ai/openswarm" target="_blank" rel="noopener noreferrer">
              OpenSwarm
            </a>
            . Glixyswarm is our independent implementation.
          </p>
        </div>

        <FooterCol title="Product" links={[
          { label: 'Features',  href: '#features'   },
          { label: 'Workflows', href: '#workflows'  },
          { label: 'Setup',     href: '#setup'      },
          { label: 'Download',  href: '#download'   },
        ]} />

        <FooterCol title="Resources" links={[
          { label: 'Docs',     href: 'https://glixylabs.com/docs.html' },
          { label: 'GitHub',   href: 'https://github.com/glixylabs/glixyswarm' },
          { label: 'Releases', href: 'https://github.com/glixylabs/glixyswarm/releases' },
          { label: 'Issues',   href: 'https://github.com/glixylabs/glixyswarm/issues' },
        ]} />

        <FooterCol title="Glixy Labs" links={[
          { label: 'Home',     href: 'https://glixylabs.com' },
          { label: 'Aether',   href: 'https://glixylabs.com/product-aether.html' },
          { label: 'Features', href: 'https://glixylabs.com/features/' },
          { label: 'Contact',  href: 'https://glixylabs.com/contact.html' },
        ]} />
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-ink-800/10 px-6 pt-6 text-[11px] uppercase tracking-[0.18em] text-ink-500 sm:flex-row sm:items-center">
        <p className="font-mono">© 2026 Glixy Labs · MIT license</p>
        <p className="font-mono">Built in India · Hosted globally</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[13.5px] text-ink-300 transition-colors hover:text-ink-100"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
