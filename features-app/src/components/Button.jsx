import { motion } from 'framer-motion';

export function PrimaryButton({ children, href = '#', icon: Icon, onClick }) {
  const Comp = href ? motion.a : motion.button;
  return (
    <Comp
      href={href || undefined}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-glow-orange"
    >
      <span
        className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,#ff6a1f_0%,#ff8a3d_50%,#ffb37a_100%)] bg-[length:220%_100%] animate-gradient-pan"
        aria-hidden="true"
      />
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" aria-hidden="true" />
      <span className="relative flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4" strokeWidth={2.5} /> : null}
        {children}
      </span>
    </Comp>
  );
}

export function GhostButton({ children, href = '#', icon: Icon, onClick }) {
  const Comp = href ? motion.a : motion.button;
  return (
    <Comp
      href={href || undefined}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-800 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(26,20,16,0.4)] ring-1 ring-white/10 transition-colors hover:bg-ink-700"
    >
      {Icon ? <Icon className="h-4 w-4" strokeWidth={2.5} /> : null}
      {children}
    </Comp>
  );
}
