import { motion } from 'framer-motion';

/**
 * Cartoon companion character — original SVG illustration.
 * Inspired by playful desktop-mascot aesthetics. Not copied from any external repo.
 */
export function Character({
  color = '#ff8a3d',
  accent = '#ff6a1f',
  size = 120,
  delay = 0,
  floatDuration = 5,
  label,
}) {
  const ids = label || color;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: size, height: size * 1.15 }}
      className="relative select-none"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-full w-full"
      >
        {/* glow */}
        <div
          aria-hidden="true"
          style={{ background: `radial-gradient(closest-side, ${color}55, transparent 70%)` }}
          className="absolute inset-x-4 -bottom-6 h-12 blur-2xl"
        />
        {/* shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 -bottom-2 h-3 rounded-full bg-ink-800/15 blur-md animate-pulse-soft"
        />
        <svg viewBox="0 0 120 138" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`body-${ids}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor={color}  />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
            <radialGradient id={`shine-${ids}`} cx="0.3" cy="0.25" r="0.6">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* body */}
          <rect x="14" y="32" width="92" height="84" rx="34" fill={`url(#body-${ids})`} />
          <rect x="14" y="32" width="92" height="84" rx="34" fill={`url(#shine-${ids})`} />

          {/* antenna */}
          <line x1="60" y1="20" x2="60" y2="32" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="16" r="5" fill={accent} />
          <circle cx="58" cy="14" r="1.4" fill="#fff" opacity="0.85" />

          {/* face plate */}
          <rect x="26" y="48" width="68" height="40" rx="18" fill="#1a1410" opacity="0.88" />

          {/* eyes (blinking) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{
              duration: 4.5,
              times: [0, 0.92, 0.95, 0.98, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '46px 68px', transformBox: 'fill-box' }}
          >
            <circle cx="46" cy="68" r="5" fill="#ffffff" />
            <circle cx="47.5" cy="66.5" r="1.6" fill={accent} />
          </motion.g>
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{
              duration: 4.5,
              times: [0, 0.92, 0.95, 0.98, 1],
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '74px 68px', transformBox: 'fill-box' }}
          >
            <circle cx="74" cy="68" r="5" fill="#ffffff" />
            <circle cx="75.5" cy="66.5" r="1.6" fill={accent} />
          </motion.g>

          {/* smile */}
          <path d="M50 78 Q60 84 70 78" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />

          {/* arms */}
          <rect x="6"   y="62" width="12" height="26" rx="6" fill={color} />
          <rect x="102" y="62" width="12" height="26" rx="6" fill={color} />

          {/* feet */}
          <rect x="34" y="114" width="18" height="10" rx="5" fill={accent} />
          <rect x="68" y="114" width="18" height="10" rx="5" fill={accent} />
        </svg>
      </motion.div>

      {label ? (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 rounded-full bg-ink-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white shadow-md">
          {label}
        </div>
      ) : null}
    </motion.div>
  );
}
