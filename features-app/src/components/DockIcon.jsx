import { useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * macOS-style dock icon with magnification on mouse proximity.
 * `mouseX` is the parent dock's MotionValue.
 */
export function DockIcon({ mouseX, icon: Icon, color = '#ff8a3d', label }) {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (v) => {
    const el = ref.current;
    if (!el) return 1000;
    const rect = el.getBoundingClientRect();
    return v - (rect.left + rect.width / 2);
  });
  const sizeRaw = useTransform(distance, [-140, 0, 140], [56, 86, 56]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      className="group relative flex aspect-square items-end justify-center"
    >
      <motion.button
        aria-label={label}
        className="relative grid h-full w-full place-items-center rounded-2xl shadow-[0_10px_24px_-8px_rgba(26,20,16,0.35)] ring-1 ring-white/40"
        style={{
          background: `linear-gradient(155deg, ${color} 0%, color-mix(in oklab, ${color} 60%, #ffffff) 100%)`,
        }}
      >
        <Icon className="h-1/2 w-1/2 text-white drop-shadow-sm" strokeWidth={2.4} />
      </motion.button>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-800/95 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </motion.div>
  );
}
