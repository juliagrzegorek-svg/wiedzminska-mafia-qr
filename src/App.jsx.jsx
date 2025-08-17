import React, { useEffect, useState } from 'react';
import WitcherDeck from './components/WitcherDeck.jsx';
import HostLobby from './components/HostLobby.jsx';
import PlayerView from './components/PlayerView.jsx';
import CardCatalog from './components/CardCatalog.jsx';

export default function App() {
  const [mode, setMode] = useState(() => (window.location.hash ? 'player' : 'host'));
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setMode(window.location.hash ? 'player' : 'host');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="min-h-screen">
      {/* HAMBURGER */}
      <button
        aria-label="Otwórz katalog kart"
        onClick={() => setCatalogOpen(true)}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-zinc-700/60 bg-zinc-900/80 text-zinc-200 shadow-md backdrop-blur hover:bg-zinc-900"
      >
        <span className="block h-0.5 w-5 bg-current"></span>
        <span className="mt-1 block h-0.5 w-5 bg-current"></span>
        <span className="mt-1 block h-0.5 w-5 bg-current"></span>
      </button>

      {/* Tryb */}
      {mode === 'player' ? (
        <PlayerView />
      ) : (
        <>
          <div className="mx-auto max-w-5xl px-4 py-6">
            <header className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-white">Szepty Lasu — Wiedźmińska Mafia</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Dodaj graczy, rozdaj postacie, a do 5 osób wylosuje karty potworów. Wygeneruj prywatne linki/QR.
              </p>
            </header>
            <HostLobby />
          </div>
          <WitcherDeck />
        </>
      )}

      {/* Katalog kart */}
      <CardCatalog open={catalogOpen} onClose={() => setCatalogOpen(false)} />
    </div>
  );
}
