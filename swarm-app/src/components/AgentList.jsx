import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Bot, Wrench } from 'lucide-react';
import { bridge } from '../lib/bridge.js';

const PROVIDERS = [
  { id: 'openai',    label: 'OpenAI'    },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'ollama',    label: 'Ollama'    },
];

const AVAILABLE_TOOLS = ['web_search', 'file_read', 'file_write', 'python_exec', 'shell_exec'];

export function AgentList() {
  const [agents,   setAgents]   = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { bridge.listAgents().then(setAgents); }, []);

  const save = async (agent) => {
    const updated = await bridge.saveAgent(agent);
    setAgents(updated);
    setEditing(null);
    setCreating(false);
  };

  const remove = async (id) => {
    if (!confirm('Delete this agent?')) return;
    const updated = await bridge.deleteAgent(id);
    setAgents(updated);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-ink-800/10 px-8 py-5">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.01em] serif-em">
            Your <em className="gradient-text font-normal">agents</em>
          </h1>
          <p className="mt-0.5 text-sm text-ink-400">
            Define roles, models, and toolbelts. Compose them into swarms.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink-200"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
          New agent
        </button>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-ink-800/10 bg-white/80 p-5 shadow-soft transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(26,20,16,0.25)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl text-white"
                    style={{ background: 'linear-gradient(155deg, #ff6a1f, #ffb37a)' }}
                  >
                    <Bot className="h-4 w-4" strokeWidth={2.4} />
                  </span>
                  <div>
                    <p className="font-medium tracking-[-0.01em]">{a.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                      {a.provider} · {a.model}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(a)}
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-ink-900/5 hover:text-ink-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-ink-400">
                {a.instructions}
              </p>
              {a.tools?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.tools.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-ink-800/5 px-2 py-0.5 font-mono text-[10px] text-ink-400 ring-1 ring-ink-800/10"
                    >
                      <Wrench className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {(editing || creating) && (
        <AgentDialog
          agent={editing || { name: '', instructions: '', model: 'gpt-4o-mini', provider: 'openai', tools: [] }}
          onSave={save}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}
    </div>
  );
}

function AgentDialog({ agent, onSave, onClose }) {
  const [form, setForm] = useState(agent);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTool = (t) => {
    const has = form.tools.includes(t);
    set('tools', has ? form.tools.filter((x) => x !== t) : [...form.tools, t]);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-100/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold tracking-[-0.01em]">
          {agent.id ? 'Edit agent' : 'New agent'}
        </h2>

        <div className="mt-5 space-y-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="planner"
              className="w-full rounded-xl border border-ink-800/15 bg-ink-900/40 px-3 py-2.5 text-sm focus:border-accent-orange focus:bg-white focus:outline-none"
            />
          </Field>

          <Field label="Instructions">
            <textarea
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
              rows={4}
              placeholder="Describe what this agent should do..."
              className="w-full resize-none rounded-xl border border-ink-800/15 bg-ink-900/40 px-3 py-2.5 text-sm focus:border-accent-orange focus:bg-white focus:outline-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Provider">
              <select
                value={form.provider}
                onChange={(e) => set('provider', e.target.value)}
                className="w-full rounded-xl border border-ink-800/15 bg-ink-900/40 px-3 py-2.5 text-sm focus:border-accent-orange focus:bg-white focus:outline-none"
              >
                {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Model">
              <input
                value={form.model}
                onChange={(e) => set('model', e.target.value)}
                placeholder="gpt-4o-mini"
                className="w-full rounded-xl border border-ink-800/15 bg-ink-900/40 px-3 py-2.5 text-sm focus:border-accent-orange focus:bg-white focus:outline-none"
              />
            </Field>
          </div>

          <Field label="Tools">
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOOLS.map((t) => {
                const on = form.tools.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTool(t)}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                      on
                        ? 'bg-accent-orange/15 text-accent-deep ring-1 ring-accent-orange/30'
                        : 'bg-ink-900/5 text-ink-500 ring-1 ring-ink-800/10 hover:bg-ink-900/10'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-400 hover:bg-ink-900/5 hover:text-ink-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...form, id: form.id || `a${Date.now()}` })}
            disabled={!form.name.trim() || !form.instructions.trim()}
            className="rounded-full bg-accent-orange px-4 py-2 text-sm font-semibold text-white shadow-glow-orange disabled:opacity-50"
          >
            {agent.id ? 'Save changes' : 'Create agent'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}
