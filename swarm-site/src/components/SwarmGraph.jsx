import { motion } from 'framer-motion';

/**
 * Animated multi-agent orchestration visualization — original SVG.
 * Center coordinator node connects to spec agents via animated dashed paths
 * representing message flow.
 */
export function SwarmGraph({ size = 360 }) {
  const center = { x: 200, y: 160 };
  const nodes = [
    { id: 'coord',  x: 200, y: 160, r: 28, color: '#ff6a1f', bgColor: '#1a1410',                           label: 'Coordinator' },
    { id: 'plan',   x: 60,  y: 60,  r: 22, color: '#ff6a1f', bgColor: 'rgba(255,106,31,0.10)',             label: 'Planner'     },
    { id: 'res',    x: 340, y: 60,  r: 22, color: '#ff8a3d', bgColor: 'rgba(255,138,61,0.10)',             label: 'Researcher'  },
    { id: 'code',   x: 60,  y: 260, r: 22, color: '#ffb37a', bgColor: 'rgba(255,179,122,0.12)',            label: 'Coder'       },
    { id: 'review', x: 340, y: 260, r: 22, color: '#e55510', bgColor: 'rgba(229,85,16,0.12)',              label: 'Reviewer'    },
    { id: 'tools',  x: 200, y: 300, r: 20, color: '#1a1410', bgColor: 'rgba(26,20,16,0.06)',               label: 'Tools'       },
  ];

  const edges = nodes.slice(1).map((n) => ({
    id: n.id,
    from: { x: center.x, y: center.y },
    to:   { x: n.x,      y: n.y      },
    color: n.color,
  }));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Soft glow halos */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-12 -top-6 h-40 rounded-full bg-orb-orange blur-3xl" />
        <div className="absolute inset-x-12 -bottom-6 h-40 rounded-full bg-orb-peach blur-3xl" />
      </div>

      <svg viewBox="0 0 400 360" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {nodes.map((n) => (
            <radialGradient key={`g-${n.id}`} id={`g-${n.id}`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"   stopColor={n.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.0" />
            </radialGradient>
          ))}
        </defs>

        {/* Edges */}
        <g>
          {edges.map((e, i) => (
            <g key={e.id}>
              <line
                x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
                stroke="rgba(26,20,16,0.10)" strokeWidth="1"
              />
              <line
                x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
                stroke={e.color} strokeOpacity="0.65"
                strokeWidth="1.4"
                strokeDasharray="6 8"
                style={{ animation: `dash 4s linear ${i * -0.4}s infinite` }}
              />
            </g>
          ))}
        </g>

        {/* Node halos */}
        {nodes.map((n) => (
          <circle key={`halo-${n.id}`} cx={n.x} cy={n.y} r={n.r + 18} fill={`url(#g-${n.id})`} opacity="0.85" />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle
              cx={n.x} cy={n.y} r={n.r}
              fill={n.bgColor}
              stroke={n.color} strokeOpacity="0.6" strokeWidth="1.5"
            />
            <circle cx={n.x} cy={n.y} r={n.r - 8} fill={n.color} opacity="0.9" />
            <text
              x={n.x} y={n.y + n.r + 16}
              textAnchor="middle"
              fontSize="11"
              fontFamily="'JetBrains Mono', monospace"
              fill="#4a3f37"
              letterSpacing="0.04em"
            >
              {n.label}
            </text>
          </motion.g>
        ))}

        {/* Pulse rings on coordinator */}
        {[0, 1].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={center.x} cy={center.y}
            r={28}
            fill="none"
            stroke="#ff6a1f"
            strokeOpacity="0.5"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
