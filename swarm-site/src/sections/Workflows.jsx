import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Layers, RotateCcw, Users } from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';

const flows = [
  {
    icon: ArrowRight,
    title: 'Sequential',
    body: 'Agent A finishes, hands off to Agent B, then C. Predictable, debuggable, perfect for pipelines.',
    color: '#ff6a1f',
    nodes: ['Plan', 'Code', 'Test', 'Ship'],
  },
  {
    icon: GitBranch,
    title: 'Parallel fan-out',
    body: 'One task explodes into N parallel workers. A reducer collects the results. Great for research.',
    color: '#ff8a3d',
    nodes: ['Query', 'Worker × 4', 'Merge'],
  },
  {
    icon: Layers,
    title: 'Hierarchical',
    body: 'A supervisor delegates to specialists. Specialists can spawn sub-supervisors. Tree as deep as you need.',
    color: '#ffb37a',
    nodes: ['Supervisor', 'Specialist × 3', 'Tool'],
  },
  {
    icon: RotateCcw,
    title: 'Loop with judge',
    body: 'An agent generates, a judge scores, the loop continues until quality passes a threshold or budget is hit.',
    color: '#e55510',
    nodes: ['Generator', 'Judge', 'Repeat'],
  },
];

export function Workflows() {
  return (
    <section id="workflows" className="relative py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-white/40 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.06)}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-deep">
            Workflows
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-balance text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink-100 serif-em">
            Four orchestration patterns. <em className="gradient-text font-normal">Infinite combinations.</em>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger(0.08)}
          className="mt-14 grid gap-5 lg:grid-cols-2"
        >
          {flows.map(({ icon: Icon, title, body, color, nodes }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-3xl border border-ink-800/15 bg-white/70 p-7 backdrop-blur ring-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl text-white ring-1 ring-white/30"
                    style={{ background: `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))` }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink-100">{title}</h3>
                </div>
                <Users className="h-4 w-4 text-ink-500" />
              </div>

              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-400">{body}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {nodes.map((n, i) => (
                  <span key={n} className="flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-mono ring-1"
                      style={{ background: `${color}1a`, color: '#1a1410', borderColor: `${color}55` }}
                    >
                      {n}
                    </span>
                    {i < nodes.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-ink-500" />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
