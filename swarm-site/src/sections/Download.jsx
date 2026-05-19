import { motion } from 'framer-motion';
import { Apple, Cpu } from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';

const platforms = [
  {
    name:    'macOS',
    meta:    '13 Ventura+ · Apple Silicon & Intel',
    file:    'Glixyswarm-0.1.0-mac.dmg',
    size:    '78 MB',
    href:    'https://github.com/Glixy-Labs/glixy_labs/releases/latest/download/Glixyswarm-mac.dmg',
    Icon:    Apple,
    color:   '#ff6a1f',
    primary: true,
  },
  {
    name:    'Windows',
    meta:    '10 / 11 · x64 · MSI installer',
    file:    'Glixyswarm-0.1.0-win.exe',
    size:    '82 MB',
    href:    'https://github.com/Glixy-Labs/glixy_labs/releases/latest/download/Glixyswarm-win.exe',
    Icon:    WindowsIcon,
    color:   '#ff8a3d',
  },
  {
    name:    'Linux',
    meta:    'Ubuntu, Debian, Fedora, Arch · x86_64 / arm64',
    file:    'Glixyswarm-0.1.0.AppImage',
    size:    '74 MB',
    href:    'https://github.com/Glixy-Labs/glixy_labs/releases/latest/download/Glixyswarm.AppImage',
    Icon:    LinuxIcon,
    color:   '#ffb37a',
  },
];

export function Download() {
  return (
    <section id="download" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.06)}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-deep">
            Download
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-balance text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink-100 serif-em">
            Get the desktop app. <em className="gradient-text font-normal">Pick your OS.</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-ink-400">
            Auto-updates via signed release channels. Source is on GitHub — feel free to
            build it yourself.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger(0.07)}
          className="mt-14 grid gap-5 sm:grid-cols-3"
        >
          {platforms.map((p) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white/80 p-7 backdrop-blur ring-soft transition-shadow hover:shadow-card ${
                p.primary ? 'border-accent-orange/40' : 'border-ink-800/15'
              }`}
            >
              {p.primary && (
                <span className="absolute right-4 top-4 rounded-full bg-accent-orange/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-deep ring-1 ring-accent-orange/30">
                  Recommended
                </span>
              )}
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-white ring-1 ring-white/30 shadow-[0_10px_22px_-10px_rgba(255,106,31,0.5)]"
                style={{ background: `linear-gradient(155deg, ${p.color}, color-mix(in oklab, ${p.color} 55%, #fff))` }}
              >
                <p.Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-ink-100">
                {p.name}
              </h3>
              <p className="mt-1 text-xs text-ink-500">{p.meta}</p>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-ink-100/5 px-3 py-2.5 ring-1 ring-ink-800/10">
                <code className="truncate font-mono text-[11px] text-ink-200">{p.file}</code>
                <span className="ml-3 shrink-0 font-mono text-[11px] text-ink-500">{p.size}</span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-medium text-ink-100">Download</span>
                <span
                  className="grid h-7 w-7 place-items-center rounded-full transition-transform group-hover:translate-x-0.5"
                  style={{ background: `${p.color}22`, color: p.color }}
                >
                  →
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-xs text-ink-500"
        >
          <Cpu className="h-3.5 w-3.5" />
          ~80 MB installer · expands to ~210 MB on disk · runs in &lt; 200 MB RAM idle
        </motion.p>
      </div>
    </section>
  );
}

function WindowsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M0 3.5L9.7 2.2v9.4H0V3.5zm10.6-1.4L24 0v11.6H10.6V2.1zM0 12.5h9.7V22L0 20.5v-8zm10.6 0H24V24l-13.4-1.9V12.5z" />
    </svg>
  );
}

function LinuxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.717-.13 2.523-.046.137-.08.276-.098.418-.39 3.117 2.5 4.97 5.143 5.158 2.642.187 5.34-1.286 5.748-3.748l.05-.005c.71-.013 1.27-.328 1.62-.836.336-.486.508-1.118.654-1.776.146-.658.295-1.367.467-1.972.16-.566.387-.96.726-1.105.366-.158.708-.41.917-.788.232-.42.249-.952.106-1.602-.243-1.117-1.16-1.84-2.067-1.873-.214-.008-.43-.005-.66.044a.832.832 0 0 1-.107.022c-.273.057-.483-.16-.5-.495-.013-.226.005-.473.083-.713.245-.715.13-1.32-.296-1.768-.426-.45-1.105-.762-1.86-.832h-.027c-.226-.02-.428-.022-.628-.022-2.067 0-2.7 2.05-2.7 3.072 0 .47.116.84.116 1.32 0 .57-.42 1.07-1.116 1.39-.696.318-1.487.4-2.193.4-.717 0-1.382-.082-1.92-.4-.538-.32-.92-.82-.92-1.39 0-.48.116-.85.116-1.32 0-1.022-.633-3.072-2.7-3.072-.2 0-.402.002-.628.022z" />
    </svg>
  );
}
