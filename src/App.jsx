import React, { useEffect, useMemo, useState } from 'react';
import WitcherDeck from './components/WitcherDeck.jsx';
import HostLobby from './components/HostLobby.jsx';
import PlayerView from './components/PlayerView.jsx';
import PlayerStart from './components/PlayerStart.jsx';

function useQueryFlag(name) {
  const [flag, setFlag] = useState(() => new URLSearchParams(window.location.search).has(name));
  useEffect(() => {
    const onChange = () => setFlag(new URLSearchParams(window.location.search).has(name));
    window.addEventListener('popstate', onChange);
    window.addEventListener('pushstate', onChange);
    return () => { window.removeEventListener('popstate', onChange); window.removeEventListener('pushstate', onChange); };
  }, []);
  return flag;
}

export default function App() {
  const isJoin = useQueryFlag("join");          // wspólny QR → /?join=1
  const [mode, setMode] = useState(() => (window.location.hash ? 'player' : 'host'));
  useEffect(() => {
    const onHash = () => setMode(window.location.hash ? 'player' : 'host');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (mode === 'player') return <PlayerView />;
  if (isJoin) return <PlayerStart />;           // ekran kafelka

  // domyślnie — panel gospodarza
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Szepty Lasu — Wiedźmińska Mafia</h1>
          <p className="mt-1 text-sm text-zinc-400">Dodaj graczy, rozdaj postacie, losuj potwory, a następnie wyślij prywatne linki/QR.</p>
        </header>
        <HostLobby />
      </div>
      <WitcherDeck />
    </div>
  );
}
