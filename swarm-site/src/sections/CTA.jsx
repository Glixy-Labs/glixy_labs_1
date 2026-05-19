import { motion } from 'framer-motion';
import { Download, Github } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/Button.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger(0.1)}
        className="mx-auto max-w-4xl px-6"
      >
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-[36px] bg-ink-100 px-8 py-14 text-center sm:px-14 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-orange/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent-light/30 blur-3xl"
          />
          <div className="relative">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
              Ready when you are
            </p>
            <h2 className="text-balance text-[clamp(28px,4.6vw,48px)] font-bold leading-[1.06] tracking-[-0.02em] text-white serif-em">
              Spin up your first swarm <em className="gradient-text font-normal">tonight</em>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
              One download, three commands, infinite agents. Free, MIT, yours.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="#download" icon={Download} size="lg">
                Download Glixyswarm
              </PrimaryButton>
              <GhostButton
                href="https://github.com/glixylabs/glixyswarm"
                target="_blank"
                icon={Github}
                size="lg"
              >
                View on GitHub
              </GhostButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
