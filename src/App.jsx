import React, { useEffect, useState } from 'react';
import WitcherDeck from './components/WitcherDeck.jsx';
import HostLobby from './components/HostLobby.jsx';
import PlayerView from './components/PlayerView.jsx';

export default function App() {
  const [mode, setMode] = useState(() => (window.location.hash ? 'player' : 'host'));
  useEffect(() => {
    const onHash = () => setMode(window.location.hash ? 'player' : 'host');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (mode === 'player') return <PlayerView />;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Szepty Lasu — Wiedźmińska Mafia</h1>
          <p className="mt-1 text-sm text-zinc-400">Dodaj graczy, rozdaj postacie, a 5 osób wylosuje karty potworów. Wygeneruj prywatne linki/QR.</p>
        </header>
        <HostLobby />
      </div>
      <WitcherDeck />
    </div>
  );
}
