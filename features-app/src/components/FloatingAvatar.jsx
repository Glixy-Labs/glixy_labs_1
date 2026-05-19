import { motion } from 'framer-motion';

export function FloatingAvatar() {
  return (
    <motion.a
      href="#cta"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.05 }}
      className="fixed right-5 top-5 z-40 grid h-12 w-12 place-items-center rounded-full shadow-glow-orange ring-1 ring-white/50 md:right-7 md:top-7 md:h-14 md:w-14"
      style={{ background: 'linear-gradient(155deg, #ff6a1f, #ffb37a)' }}
      aria-label="Get Glixy AI"
    >
      <motion.svg
        viewBox="0 0 24 28"
        className="h-7 w-7 md:h-8 md:w-8"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="3" y="6" width="18" height="16" rx="6" fill="#ffffff" />
        <rect x="6" y="10" width="12" height="8" rx="3" fill="#1a1410" />
        <motion.circle
          cx="9.5" cy="14" r="1.4" fill="#ff6a1f"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
          style={{ transformOrigin: '9.5px 14px', transformBox: 'fill-box' }}
        />
        <motion.circle
          cx="14.5" cy="14" r="1.4" fill="#ff6a1f"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
          style={{ transformOrigin: '14.5px 14px', transformBox: 'fill-box' }}
        />
        <line x1="12" y1="2" x2="12" y2="6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="2" r="1.4" fill="#ffffff" />
      </motion.svg>
    </motion.a>
  );
}
