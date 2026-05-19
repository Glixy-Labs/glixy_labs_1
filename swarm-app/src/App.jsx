import { useState } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { AgentList } from './components/AgentList.jsx';
import { RunView } from './components/RunView.jsx';
import { SettingsView } from './components/SettingsView.jsx';

export default function App() {
  const [tab, setTab] = useState('runs');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink-100">
      <Sidebar active={tab} onChange={setTab} runCount={0} />
      <main className="flex-1 overflow-hidden">
        {tab === 'agents'   && <AgentList />}
        {tab === 'runs'     && <RunView />}
        {tab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
