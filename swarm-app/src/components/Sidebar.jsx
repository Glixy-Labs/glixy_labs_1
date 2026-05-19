import { Users, Activity, Settings as Cog, Sparkles } from 'lucide-react';

const items = [
  { id: 'agents',   label: 'Agents',   icon: Users    },
  { id: 'runs',     label: 'Runs',     icon: Activity },
  { id: 'settings', label: 'Settings', icon: Cog      },
];

export function Sidebar({ active, onChange, runCount }) {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-ink-800/15 bg-white/80">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-ink-800/10 px-4">
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #ff6a1f, #ffb37a)' }}
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <span className="font-semibold tracking-tight">
          Glixy<span className="text-accent-orange">swarm</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-3">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-accent-orange/10 font-medium text-accent-deep ring-1 ring-accent-orange/20'
                  : 'text-ink-400 hover:bg-ink-900/5 hover:text-ink-100'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" strokeWidth={2.2} />
                {label}
              </span>
              {id === 'runs' && runCount > 0 ? (
                <span className="rounded-full bg-accent-orange/15 px-1.5 py-0.5 font-mono text-[10px] text-accent-deep">
                  {runCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-ink-800/10 px-4 py-3 text-[11px] text-ink-500">
        <p className="font-mono uppercase tracking-[0.18em]">v0.1.0 · MIT</p>
        <p className="mt-1">Local & private by default.</p>
      </div>
    </aside>
  );
}
