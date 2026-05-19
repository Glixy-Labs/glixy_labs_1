import { motion } from 'framer-motion';

export function PrimaryButton({ children, href = '#', icon: Icon, onClick, target, size = 'md' }) {
  const sizeCls = size === 'lg' ? 'px-7 py-4 text-[15px]' : 'px-5 py-3 text-sm';
  const Comp = href ? motion.a : motion.button;
  return (
    <Comp
      href={href || undefined}
      onClick={onClick}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white shadow-glow-orange ${sizeCls}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,#ff6a1f_0%,#ff8a3d_50%,#ffb37a_100%)] bg-[length:220%_100%] animate-gradient-pan"
      />
      <span aria-hidden="true" className="absolute inset-0 rounded-full ring-1 ring-white/30" />
      <span className="relative flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4" strokeWidth={2.5} /> : null}
        {children}
      </span>
    </Comp>
  );
}

export function GhostButton({ children, href = '#', icon: Icon, onClick, target, size = 'md' }) {
  const sizeCls = size === 'lg' ? 'px-7 py-4 text-[15px]' : 'px-5 py-3 text-sm';
  const Comp = href ? motion.a : motion.button;
  return (
    <Comp
      href={href || undefined}
      onClick={onClick}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold text-ink-100 ring-1 ring-ink-700 bg-white/80 transition-colors hover:bg-white ${sizeCls}`}
    >
      {Icon ? <Icon className="h-4 w-4" strokeWidth={2.5} /> : null}
      {children}
    </Comp>
  );
}
