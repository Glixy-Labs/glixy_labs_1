/**
 * Tauri bridge — invokes Rust commands defined in src-tauri/src/main.rs.
 * Falls back to a browser-only mock when running in plain `npm run dev`
 * (no Tauri runtime) so the UI is developable without compiling Rust.
 */

const hasTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// Mock store used when running outside Tauri (browser preview).
const MOCK_STORE = {
  agents: [
    { id: 'a1', name: 'planner',    instructions: "Break the user's goal into a short, ordered plan.",      model: 'gpt-4o-mini',        provider: 'openai',    tools: [] },
    { id: 'a2', name: 'researcher', instructions: 'Use web_search to gather facts. Cite every source.',     model: 'claude-sonnet-4-6',  provider: 'anthropic', tools: ['web_search'] },
    { id: 'a3', name: 'writer',     instructions: 'Turn the research into a tight 200-word brief.',         model: 'gpt-4o',             provider: 'openai',    tools: [] },
  ],
  runs: [],
  settings: { openaiKey: '', anthropicKey: '', ollamaUrl: 'http://localhost:11434' },
};

let _tauriInvoke = null;
let _tauriListen = null;

async function getInvoke() {
  if (!hasTauri) return null;
  if (_tauriInvoke) return _tauriInvoke;
  const mod = await import('@tauri-apps/api/core');
  _tauriInvoke = mod.invoke;
  return _tauriInvoke;
}

async function getListen() {
  if (!hasTauri) return null;
  if (_tauriListen) return _tauriListen;
  const mod = await import('@tauri-apps/api/event');
  _tauriListen = mod.listen;
  return _tauriListen;
}

async function invoke(cmd, args = {}) {
  if (hasTauri) {
    const invokeFn = await getInvoke();
    return invokeFn(cmd, args);
  }
  return mockInvoke(cmd, args);
}

async function mockInvoke(cmd, args) {
  if (cmd === 'list_agents') return MOCK_STORE.agents;
  if (cmd === 'save_agent') {
    const a = args.agent;
    const i = MOCK_STORE.agents.findIndex((x) => x.id === a.id);
    if (i >= 0) MOCK_STORE.agents[i] = a;
    else MOCK_STORE.agents.push({ ...a, id: a.id || `a${Date.now()}` });
    return MOCK_STORE.agents;
  }
  if (cmd === 'delete_agent') {
    MOCK_STORE.agents = MOCK_STORE.agents.filter((x) => x.id !== args.id);
    return MOCK_STORE.agents;
  }
  if (cmd === 'get_settings')   return MOCK_STORE.settings;
  if (cmd === 'save_settings') {
    Object.assign(MOCK_STORE.settings, args.settings);
    return MOCK_STORE.settings;
  }
  if (cmd === 'start_run') {
    const id = `r${Date.now()}`;
    MOCK_STORE.runs.unshift({ id, goal: args.goal, flow: args.flow, status: 'running', steps: [] });
    setTimeout(() => window.dispatchEvent(new CustomEvent('run-step', { detail: { runId: id, step: { agent: 'planner',    role: 'assistant', text: 'Plan: 1) gather facts 2) summarize 3) write brief' } } })), 600);
    setTimeout(() => window.dispatchEvent(new CustomEvent('run-step', { detail: { runId: id, step: { agent: 'researcher', role: 'tool',      text: 'web_search("India AI compute") → 8 results' } } })), 1400);
    setTimeout(() => window.dispatchEvent(new CustomEvent('run-step', { detail: { runId: id, step: { agent: 'researcher', role: 'assistant', text: 'Key facts: India ranks 4th in AI compute capacity (2025). NVIDIA H100 imports doubled YoY...' } } })), 2400);
    setTimeout(() => window.dispatchEvent(new CustomEvent('run-step', { detail: { runId: id, step: { agent: 'writer',     role: 'assistant', text: 'India is shifting fast in AI compute. The country sits at #4 globally...' } } })), 3400);
    setTimeout(() => window.dispatchEvent(new CustomEvent('run-finished', { detail: { runId: id } })), 4000);
    return { id };
  }
  if (cmd === 'list_runs') return MOCK_STORE.runs;
  throw new Error('unknown command: ' + cmd);
}

async function on(event, cb) {
  if (hasTauri) {
    const listen = await getListen();
    return listen(event, (e) => cb(e.payload));
  }
  const handler = (e) => cb(e.detail);
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}

export const bridge = {
  listAgents:    ()                            => invoke('list_agents'),
  saveAgent:     (agent)                       => invoke('save_agent',  { agent }),
  deleteAgent:   (id)                          => invoke('delete_agent', { id }),
  getSettings:   ()                            => invoke('get_settings'),
  saveSettings:  (settings)                    => invoke('save_settings', { settings }),
  startRun:      (goal, flow, agentIds)        => invoke('start_run',   { goal, flow, agentIds }),
  listRuns:      ()                            => invoke('list_runs'),
  onRunStep:     (cb)                          => on('run-step',     cb),
  onRunFinished: (cb)                          => on('run-finished', cb),
  hasTauri,
};
