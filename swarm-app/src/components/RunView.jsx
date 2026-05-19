import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, GitBranch, ArrowRight, Layers, RotateCcw, Bot, Wrench, User } from 'lucide-react';
import { bridge } from '../lib/bridge.js';

const FLOWS = [
  { id: 'sequential', label: 'Sequential', icon: ArrowRight },
  { id: 'parallel',   label: 'Parallel',   icon: GitBranch  },
  { id: 'hierarchical', label: 'Hierarchical', icon: Layers },
  { id: 'loop',       label: 'Loop',       icon: RotateCcw  },
];

export function RunView() {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [flow, setFlow] = useState('sequential');
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState([]);
  const [running, setRunning] = useState(false);
  const stepsEnd = useRef(null);

  useEffect(() => {
    bridge.listAgents().then((a) => {
      setAgents(a);
      setSelected(new Set(a.map((x) => x.id)));
    });
    let off1, off2;
    bridge.onRunStep((p) => setSteps((s) => [...s, p.step])).then((u) => (off1 = u));
    bridge.onRunFinished(() => setRunning(false)).then((u) => (off2 = u));
    return () => { off1 && off1(); off2 && off2(); };
  }, []);

  useEffect(() => {
    stepsEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [steps.length]);

  const start = async () => {
    if (!goal.trim()) return;
    setSteps([]);
    setRunning(true);
    await bridge.startRun(goal, flow, [...selected]);
  };

  const toggleAgent = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="flex h-full">
      {/* LEFT — run config */}
      <div className="w-[340px] shrink-0 border-r border-ink-800/10 bg-white/60 p-5">
        <h2 className="text-base font-semibold tracking-[-0.01em]">Run a swarm</h2>
        <p className="mt-0.5 text-xs text-ink-400">Pick a goal, a flow, and the agents.</p>

        <div className="mt-5">
          <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">Goal</label>
          <textarea
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Brief me on India's AI compute landscape in 200 words."
            className="w-full resize-none rounded-xl border border-ink-800/15 bg-white/80 px-3 py-2.5 text-sm focus:border-accent-orange focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">Flow</label>
          <div className="grid grid-cols-2 gap-1.5">
            {FLOWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFlow(id)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                  flow === id
                    ? 'bg-accent-orange/15 text-accent-deep ring-1 ring-accent-orange/30'
                    : 'bg-white/70 text-ink-400 ring-1 ring-ink-800/10 hover:bg-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">
            Agents · {selected.size} selected
          </label>
          <div className="space-y-1.5">
            {agents.map((a) => {
              const on = selected.has(a.id);
              return (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                    on
                      ? 'border-accent-orange/30 bg-accent-orange/5'
                      : 'border-ink-800/10 bg-white/60 hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleAgent(a.id)}
                    className="accent-accent-orange"
                  />
                  <Bot className="h-3.5 w-3.5 text-ink-500" />
                  <span className="font-medium text-ink-100">{a.name}</span>
                  <span className="ml-auto font-mono text-[10px] text-ink-500">{a.provider}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          onClick={running ? null : start}
          disabled={running || !goal.trim() || selected.size === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent-orange py-2.5 text-sm font-semibold text-white shadow-glow-orange transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? (
            <>
              <Square className="h-4 w-4 animate-pulse-soft fill-current" />
              Running…
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              Start swarm
            </>
          )}
        </button>
      </div>

      {/* RIGHT — execution timeline */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-800/10 px-8 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.01em] serif-em">
              Live <em className="gradient-text font-normal">trace</em>
            </h1>
            <p className="mt-0.5 text-sm text-ink-400">
              {steps.length === 0 ? 'Press Start to watch your swarm think.' : `${steps.length} steps`}
            </p>
          </div>
          {bridge.hasTauri ? (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              Local runtime
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-700">
              Browser preview · mock data
            </span>
          )}
        </header>

        <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-8 py-6">
          {steps.length === 0 ? (
            <EmptyState />
          ) : (
            steps.map((step, i) => <StepCard key={i} step={step} idx={i} />)
          )}
          <div ref={stepsEnd} />
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, idx }) {
  const Icon = step.role === 'tool' ? Wrench : step.role === 'user' ? User : Bot;
  const color = step.role === 'tool' ? '#3a302a' : '#ff6a1f';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3"
    >
      <div className="flex flex-col items-center">
        <span
          className="grid h-8 w-8 place-items-center rounded-full text-white"
          style={{ background: `linear-gradient(155deg, ${color}, color-mix(in oklab, ${color} 55%, #fff))` }}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="mt-1 flex-1 w-px bg-ink-800/10" />
      </div>
      <div className="flex-1 rounded-2xl border border-ink-800/10 bg-white/80 p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="font-medium text-ink-100">{step.agent}</p>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
            {step.role} · #{String(idx + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-300">
          {step.text}
        </p>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-16 max-w-md text-center text-sm text-ink-500">
      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-orange/20 to-accent-light/20" />
      <p>No run yet. Fill in a goal and press Start — every prompt, tool call, and handoff will stream here in real-time.</p>
    </div>
  );
}
