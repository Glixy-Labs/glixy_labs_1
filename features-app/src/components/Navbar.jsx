import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-30 backdrop-blur-md"
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* LEFT — brand */}
        <a
          href="https://glixylabs.com"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-ink-800"
        >
          <span
            aria-hidden="true"
            className="h-6 w-6 rounded-md shadow-sm"
            style={{ background: 'linear-gradient(135deg, #ff6a1f, #ffb37a)' }}
          />
          <span>
            Glixy{' '}
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
              Labs
            </span>
          </span>
        </a>

        {/* CENTER — nav (absolutely centered, won't shift with brand/CTA width) */}
        <nav className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 hidden items-center justify-center gap-7 text-sm text-ink-500 md:flex">
          <a className="pointer-events-auto transition-colors hover:text-ink-800" href="https://glixylabs.com">Home</a>
          <a className="pointer-events-auto transition-colors hover:text-ink-800" href="https://glixylabs.com/product-aether.html">Aether</a>
          <a className="pointer-events-auto font-medium text-ink-800" href="/features/">Features</a>
          <a className="pointer-events-auto transition-colors hover:text-ink-800" href="https://glixylabs.com/download.html">Download</a>
          <a className="pointer-events-auto transition-colors hover:text-ink-800" href="https://glixylabs.com/pricing.html">Pricing</a>
        </nav>

        {/* RIGHT — CTA */}
        <a
          href="https://lilagents.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-ink-700"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
          Get the app
        </a>
      </div>
    </motion.header>
  );
}
