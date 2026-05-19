import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ filename = 'swarm.py', language = 'python', children }) {
  const [copied, setCopied] = useState(false);
  const text = String(children).trim();

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800/20 bg-ink-100 ring-soft">
      <div className="flex items-center justify-between border-b border-ink-800/30 bg-ink-200/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 font-mono text-[11px] text-white/70">{filename}</span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto px-5 py-4 text-[13px] leading-relaxed text-white/85">
        <code className="font-mono">{text}</code>
      </pre>
    </div>
  );
}
