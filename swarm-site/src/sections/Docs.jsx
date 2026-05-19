import { motion } from 'framer-motion';
import { BookOpen, Github, MessageCircle, Sparkles } from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';

const cards = [
  {
    icon: BookOpen,
    title: 'Documentation',
    body: 'API reference, guides, recipes, and a hands-on quickstart. Everything you need.',
    href: 'https://glixylabs.com/docs.html',
    color: '#ff6a1f',
  },
  {
    icon: Github,
    title: 'Source code',
    body: 'MIT licensed. Read it, fork it, contribute. PRs welcome — we ship from main.',
    href: 'https://github.com/glixylabs/glixyswarm',
    color: '#ff8a3d',
  },
  {
    icon: MessageCircle,
    title: 'Community',
    body: 'Discord, Discussions, and a weekly office hour. We respond fast.',
    href: 'https://github.com/glixylabs/glixyswarm/discussions',
    color: '#ffb37a',
  },
  {
    icon: Sparkles,
    title: 'Recipes',
    body: 'Ready-made swarms for research, RAG, code review, customer support, and more.',
    href: 'https://github.com/glixylabs/glixyswarm/tree/main/recipes',
    color: '#e55510',
  },
];

export function Docs() {
  return (
    <section id="docs" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.06)}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-deep">
            Learn
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-balance text-[clamp(30px,4.5vw,52px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink-100 serif-em">
            Dig deeper. <em className="gradient-text font-normal">All in one place.</em>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger(0.06)}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map(({ icon: Icon, title, body, color, href }) => (
            <motion.a
              key={title}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-ink-800/15 bg-white/70 p-6 backdrop-blur ring-soft transition-shadow hover:shadow-card"
            >
              <div
                aria-hidden="true"
                style={{ background: `radial-gradient(circle at 70% 0%, ${color}22, transparent 60%)` }}
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl text-white ring-1 ring-white/30"
                  style={{ background: `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))` }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-ink-100">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-ink-100 transition-colors group-hover:text-accent-deep">
                  Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
