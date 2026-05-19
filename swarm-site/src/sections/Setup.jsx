import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { fadeUp, stagger } from '../animations/variants.js';

const SAMPLE = `from glixyswarm import Agent, Swarm, tool

@tool
def web_search(query: str) -> str:
    """Search the web and return the top result."""
    return ddg(query)[0]

planner = Agent(
    name="planner",
    instructions="Break the user's goal into a short, ordered plan.",
    model="gpt-4o-mini",
)

researcher = Agent(
    name="researcher",
    instructions="Use web_search to gather facts. Cite each source.",
    model="claude-sonnet-4-6",
    tools=[web_search],
)

writer = Agent(
    name="writer",
    instructions="Turn the research into a tight 200-word brief.",
    model="gpt-4o",
)

swarm = Swarm(agents=[planner, researcher, writer], flow="sequential")

if __name__ == "__main__":
    swarm.run("Brief me on India's AI compute landscape.")`;

export function Setup() {
  return (
    <section id="setup" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.08)}
          className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <motion.p variants={fadeUp} className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-deep">
              Setup
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-balance text-[clamp(30px,4.5vw,52px)] font-bold leading-[1.06] tracking-[-0.02em] text-ink-100 serif-em">
              From <em className="gradient-text font-normal">zero to swarm</em> in three commands.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-[15px] leading-relaxed text-ink-400">
              Pip-install the runtime, drop in your model keys, and run your first
              orchestration. No accounts, no waitlist, no opinions about your stack.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 space-y-3">
              <Step n="01" code="pip install glixyswarm" />
              <Step n="02" code='export OPENAI_API_KEY="sk-..."' />
              <Step n="03" code="glixyswarm run swarm.py" />
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <CodeBlock filename="swarm.py" language="python">{SAMPLE}</CodeBlock>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-ink-500">
              <Terminal className="h-3.5 w-3.5" />
              Runs locally. Streams in the desktop dashboard.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Step({ n, code }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ink-800/15 bg-white/80 px-4 py-3 ring-soft">
      <span className="font-mono text-[11px] text-accent-deep">{n}</span>
      <code className="flex-1 font-mono text-[13px] text-ink-100">{code}</code>
    </div>
  );
}
