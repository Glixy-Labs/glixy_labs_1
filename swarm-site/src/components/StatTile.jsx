export function StatTile({ value, label, accent = '#a78bfa' }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 ring-soft">
      <div
        className="font-display text-3xl font-bold tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-ink-400">{label}</div>
    </div>
  );
}
