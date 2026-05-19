import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function FloatingParticles({ count = 24 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = (i + 1) * 9301 + 49297;
      const r  = (seed % 233280) / 233280;
      const r2 = ((seed * 7) % 233280) / 233280;
      const r3 = ((seed * 13) % 233280) / 233280;
      return {
        id: i,
        left: 4 + r * 92,
        top: 6 + r2 * 86,
        size: 3 + r3 * 6,
        delay: r * 6,
        duration: 9 + r2 * 8,
        hue: 18 + r * 30, // orange family
      };
    });
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0], y: [0, -40, -80] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue} 95% 60% / 0.75)`,
            filter: 'blur(0.3px)',
          }}
          className="absolute rounded-full shadow-[0_0_18px_currentColor]"
        />
      ))}
    </div>
  );
}
