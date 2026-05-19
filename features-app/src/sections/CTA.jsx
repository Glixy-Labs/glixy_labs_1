import { motion } from 'framer-motion';
import { Download, Github } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/Button.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

export function CTA() {
  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger(0.1)}
        className="mx-auto max-w-4xl px-6"
      >
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-[36px] bg-ink-800 px-8 py-14 text-center sm:px-14 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-300/30 blur-3xl"
          />
          <div className="relative">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
              Free, forever
            </p>
            <h2 className="text-balance text-[clamp(30px,5vw,52px)] font-bold leading-[1.05] tracking-[-0.02em] text-white serif-em">
              Meet your <em>tiny coworkers</em>.
              <br className="hidden sm:block" /> One download, then they live on your dock.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
              MIT licensed. No accounts. Bring your own AI keys, or none at all — Glix works
              offline through Ollama too.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="https://lilagents.xyz" icon={Download}>
                Download for macOS
              </PrimaryButton>
              <GhostButton href="https://github.com/ryanstephen/lil-agents" icon={Github}>
                View on GitHub
              </GhostButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
