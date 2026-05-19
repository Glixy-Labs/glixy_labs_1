import { motion } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Terminal,
  Paintbrush,
  Cpu,
  Volume2,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';

const features = [
  {
    icon: Sparkles,
    title: 'Walking characters',
    body:
      'Companions stroll back and forth above your dock with idle floats, blinks, and gentle shadows. Click one to open a themed chat.',
    color: '#ff6a1f',
  },
  {
    icon: Terminal,
    title: 'Pluggable AI CLIs',
    body:
      'Switch between Claude Code, OpenAI Codex, GitHub Copilot, and Google Gemini from the menubar — bring your own keys.',
    color: '#ff8a3d',
  },
  {
    icon: Paintbrush,
    title: 'Four visual themes',
    body:
      'Peach, Midnight, Cloud, Moss. Match the vibe of your wallpaper. Switch instantly without restart.',
    color: '#9ec1ff',
  },
  {
    icon: Lock,
    title: 'Private by default',
    body:
      'Conversations stay on your machine. Memory in a single SQLite file. No telemetry, no cloud unless you opt in.',
    color: '#7bb27a',
  },
  {
    icon: KeyRound,
    title: 'Slash commands',
    body:
      'Type /clear, /copy, /help inside any chat input. Tiny shortcuts that keep the popover keyboard-first.',
    color: '#ec5d6c',
  },
  {
    icon: Volume2,
    title: 'Sound + thinking bubbles',
    body:
      'Playful thinking phrases while your agent works, soft completion chime when it answers. Tasteful, never loud.',
    color: '#bdac95',
  },
  {
    icon: Cpu,
    title: 'Universal binary',
    body:
      'One download runs natively on Apple Silicon and Intel Macs. Optimized for M-series with Metal GPU acceleration.',
    color: '#ff6a1f',
  },
  {
    icon: RefreshCw,
    title: 'Auto-updates',
    body:
      'Powered by Sparkle. New companions, themes, and CLI providers land automatically — you stay in flow.',
    color: '#ff8a3d',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger(0.06)}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-orange-600"
          >
            Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink-800 serif-em"
          >
            Small companions, <em>serious craft.</em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg leading-relaxed text-ink-500"
          >
            Every detail is dialed in — from the way the eyes blink to the latency of the
            popover. These aren't widgets. They're tiny coworkers.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body, color }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white/70 p-6 backdrop-blur transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(26,20,16,0.3)]"
            >
              <div
                aria-hidden="true"
                style={{ background: `radial-gradient(circle at 70% 0%, ${color}33, transparent 60%)` }}
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div
                  className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-[0_10px_24px_-10px_rgba(26,20,16,0.4)] ring-1 ring-white/30"
                  style={{ background: `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))` }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-ink-800">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
