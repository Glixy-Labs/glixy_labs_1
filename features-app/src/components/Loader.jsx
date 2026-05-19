import { motion, AnimatePresence } from 'framer-motion';

export function Loader({ visible }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-14 w-14">
              <span className="absolute inset-0 animate-spin-slow rounded-2xl bg-[conic-gradient(from_0deg,#ff6a1f,#ff8a3d,#ffb37a,#ff6a1f)]" />
              <span className="absolute inset-[3px] grid place-items-center rounded-[14px] bg-bg">
                <span className="h-3 w-3 rounded-full bg-orange-500 shadow-glow-orange" />
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Loading Glixy AI…
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
