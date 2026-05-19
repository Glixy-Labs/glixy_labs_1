import { motion } from 'framer-motion';
import { Download, ChevronRight } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/Button.jsx';
import { SwarmGraph } from '../components/SwarmGraph.jsx';
import { GitHubBadge } from '../components/GitHubBadge.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

export function Hero() {
  return (
    <section id="top" className="relative isolate pt-36 pb-20 sm:pt-44">
      {/* Background — Glixy cream/peach to match main site */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] bg-hero-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[820px]">
        <div className="absolute left-1/2 top-32 h-[420px] w-[620px] -translate-x-1/2 bg-orb-orange blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]"
        >
          <div>
            <motion.div variants={fadeUp}>
              <GitHubBadge />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-100 serif-em"
            >
              Build, run, and ship{' '}
              <em className="gradient-text font-normal">multi-agent swarms</em> right from your desktop.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-400"
            >
              Glixyswarm is an open-source orchestration runtime for teams of AI agents.
              Compose roles, route tasks, plug in tools, watch every step — all on your
              machine, all yours. Mac, Windows, Linux.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryButton href="#download" icon={Download} size="lg">
                Download Glixyswarm
              </PrimaryButton>
              <GhostButton href="#features" icon={ChevronRight} size="lg">
                See what's inside
              </GhostButton>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              v0.1.0 · MIT · macOS 13+ · Windows 10+ · Linux x86_64/arm64
            </motion.p>
          </div>

          <motion.div
            variants={fadeUp}
            className="relative mx-auto"
          >
            <SwarmGraph size={420} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
