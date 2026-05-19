import { useEffect, useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { bridge } from '../lib/bridge.js';

export function SettingsView() {
  const [s, setS] = useState({ openaiKey: '', anthropicKey: '', ollamaUrl: 'http://localhost:11434' });
  const [show, setShow] = useState({ openai: false, anthropic: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => { bridge.getSettings().then(setS); }, []);

  const save = async () => {
    await bridge.saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-ink-800/10 px-8 py-5">
        <h1 className="text-xl font-semibold tracking-[-0.01em] serif-em">
          <em className="gradient-text font-normal">Settings</em>
        </h1>
        <p className="mt-0.5 text-sm text-ink-400">
          API keys live on your machine in the app data directory. Never synced, never logged.
        </p>
      </header>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-2xl space-y-7">
          <Section title="Model providers" subtitle="Drop in keys for the cloud providers you want to use. Leave blank to skip.">
            <KeyField
              label="OpenAI API key"
              value={s.openaiKey}
              show={show.openai}
              onToggle={() => setShow((p) => ({ ...p, openai: !p.openai }))}
              onChange={(v) => setS({ ...s, openaiKey: v })}
              placeholder="sk-..."
            />
            <KeyField
              label="Anthropic API key"
              value={s.anthropicKey}
              show={show.anthropic}
              onToggle={() => setShow((p) => ({ ...p, anthropic: !p.anthropic }))}
              onChange={(v) => setS({ ...s, anthropicKey: v })}
              placeholder="sk-ant-..."
            />
          </Section>

          <Section title="Local model server" subtitle="Point Glixyswarm at your local Ollama, vLLM, or any OpenAI-compatible endpoint.">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">
                Endpoint
              </span>
              <input
                value={s.ollamaUrl}
                onChange={(e) => setS({ ...s, ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full rounded-xl border border-ink-800/15 bg-white px-3 py-2.5 text-sm focus:border-accent-orange focus:outline-none"
              />
            </label>
          </Section>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-full bg-accent-orange px-5 py-2.5 text-sm font-semibold text-white shadow-glow-orange transition-transform hover:-translate-y-0.5"
            >
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section>
      <h2 className="text-base font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="mt-1 text-sm text-ink-400">{subtitle}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function KeyField({ label, value, show, onChange, onToggle, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">{label}</span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-ink-800/15 bg-white px-3 py-2.5 pr-10 text-sm font-mono focus:border-accent-orange focus:outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-ink-900/5"
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </label>
  );
}
