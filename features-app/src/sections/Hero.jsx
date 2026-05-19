import { motion, useMotionValue } from 'framer-motion';
import { Download, Github, Sparkles } from 'lucide-react';
import { Brain, MessageSquare, Folder, Search, Settings, Wand2, Cpu } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/Button.jsx';
import { Character } from '../components/Character.jsx';
import { DockIcon } from '../components/DockIcon.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

const dockApps = [
  { icon: Brain,         color: '#ff6a1f', label: 'Reasoner' },
  { icon: MessageSquare, color: '#ff8a3d', label: 'Chat'     },
  { icon: Search,        color: '#ffb37a', label: 'Search'   },
  { icon: Folder,        color: '#9ec1ff', label: 'Files'    },
  { icon: Wand2,         color: '#ec5d6c', label: 'Tools'    },
  { icon: Cpu,           color: '#7bb27a', label: 'Runtime'  },
  { icon: Settings,      color: '#8a7f74', label: 'Settings' },
];

export function Hero() {
  const mouseX = useMotionValue(Infinity);

  return (
    <section className="relative isolate pt-32 pb-12 sm:pt-40">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white/80 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-orange-600 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          v0.4 · Public beta
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="font-sans text-balance text-[clamp(40px,7vw,80px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-800 serif-em"
        >
          Tiny <em className="bg-[linear-gradient(110deg,#ff6a1f,#ff8a3d,#ffb37a)] bg-clip-text text-transparent">AI companions</em>
          {' '}that live on your desktop.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink-500"
        >
          GLIXY AI puts a roster of cheerful agents on your macOS dock — each one walks,
          thinks, and waits for you to click. Pluggable CLIs, four themes, private by
          default, free forever.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="https://lilagents.xyz" icon={Download}>
            Download for macOS
          </PrimaryButton>
          <GhostButton href="https://github.com/ryanstephen/lil-agents" icon={Github}>
            Star on GitHub
          </GhostButton>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Universal binary · macOS 14+ · Apple Silicon &amp; Intel
        </motion.p>
      </motion.div>

      {/* Characters above dock */}
      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <div className="relative h-[260px] sm:h-[300px]">
          <div className="absolute inset-0 flex items-end justify-center gap-3 sm:gap-8 pb-24">
            <Character color="#ff8a3d" accent="#ff6a1f" size={110} delay={0.25} floatDuration={5.5} label="Glix" />
            <Character color="#9ec1ff" accent="#1a1410" size={130} delay={0.35} floatDuration={4.8} label="Aeth" />
            <Character color="#7bb27a" accent="#3a302a" size={108} delay={0.45} floatDuration={6.2} label="Nova" />
          </div>

          {/* Dock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="glass absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-2 rounded-3xl px-3.5 py-3 shadow-glass sm:gap-3 sm:px-5 sm:py-3.5"
          >
            {dockApps.map((app) => (
              <DockIcon key={app.label} mouseX={mouseX} icon={app.icon} color={app.color} label={app.label} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
