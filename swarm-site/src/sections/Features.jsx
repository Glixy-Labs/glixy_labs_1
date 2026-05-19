import { motion } from 'framer-motion';
import {
  Network,
  Workflow,
  Wrench,
  Database,
  Eye,
  Lock,
  Cpu,
  Plug,
  Layers,
  Cloud,
  Activity,
  Bot,
} from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants.js';

const features = [
  { icon: Network,  title: 'Composable agents',     body: 'Define roles with a prompt, a model, a toolbelt — then stitch them together with one-liner handoffs.', color: '#ff6a1f' },
  { icon: Workflow, title: 'Flow patterns',         body: 'Sequential pipelines, parallel fan-out, hierarchical supervisors, and loops with stopping conditions.', color: '#ff8a3d' },
  { icon: Wrench,   title: 'Tool calling',          body: 'Native OpenAI-style tools plus MCP servers. Drop a config, the tools appear inside every agent.',     color: '#ffb37a' },
  { icon: Database, title: 'Persistent memory',     body: 'Per-agent and shared memory in a single SQLite file. Survives crashes, replays, and reboots.',         color: '#e55510' },
  { icon: Eye,      title: 'Full tracing',          body: 'Every prompt, token, tool call and handoff captured. Step through the timeline in the dashboard.',     color: '#ff6a1f' },
  { icon: Lock,     title: 'Local-first & private', body: 'Conversations never leave your machine unless you connect a cloud model yourself. No telemetry.',      color: '#ff8a3d' },
  { icon: Cpu,      title: 'Any model',             body: 'OpenAI, Anthropic, Mistral, Ollama, vLLM, OpenRouter — anything that speaks OpenAI-compatible API.',  color: '#ffb37a' },
  { icon: Plug,     title: 'Pluggable runtime',     body: 'Write a Python agent. Drop in a TypeScript one. Glixyswarm bridges them through a single registry.',   color: '#e55510' },
  { icon: Layers,   title: 'Versioned releases',    body: 'Reproducible builds, signed updates, channel-based rollouts via the built-in updater.',                color: '#ff6a1f' },
  { icon: Cloud,    title: 'Optional cloud',        body: 'Lift a swarm to managed GPUs when local runs out of steam. Same agents, same memory, same code.',     color: '#ff8a3d' },
  { icon: Activity, title: 'Live dashboard',        body: 'Watch runs in real-time. Pause, fork, replay, or rewind a single step without losing state.',          color: '#ffb37a' },
  { icon: Bot,      title: 'Open & extensible',     body: 'MIT licensed. Forks welcome. Build a custom UI, custom backend, custom agents — own every layer.',     color: '#e55510' },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.06)}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-deep">
            Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-balance text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] text-ink-100 serif-em"
          >
            Everything a serious swarm needs.{' '}
            <em className="gradient-text font-normal">Nothing it doesn't.</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg leading-relaxed text-ink-400">
            Glixyswarm ships the primitives — agents, flows, tools, memory, tracing — and
            stays out of your way. Twelve focused features, zero bloat.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger(0.05)}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, body, color }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-ink-800/15 bg-white/70 p-6 backdrop-blur ring-soft transition-shadow hover:shadow-card"
            >
              <div
                aria-hidden="true"
                style={{ background: `radial-gradient(circle at 70% 0%, ${color}33, transparent 60%)` }}
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl text-white ring-1 ring-white/30 shadow-[0_8px_18px_-8px_rgba(255,106,31,0.45)]"
                  style={{ background: `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))` }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em] text-ink-100">
                  {title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-400">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
