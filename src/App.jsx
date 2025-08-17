import React, { useEffect, useState } from "react";
import PlayerStart from "./components/PlayerStart.jsx";
import PlayerView from "./components/PlayerView.jsx";
import HostLobby from "./components/HostLobby.jsx";
import WitcherDeck from "./components/WitcherDeck.jsx";

function getModeFromHash() {
  const h = window.location.hash || "";
  if (h === "#host") return "host";
  try {
    const b64 = h.replace(/^#/, "").replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const payload = JSON.parse(json);
    if (payload?.t === "player") return "player";
  } catch {}
  return "start";
}

export default function App() {
  const [mode, setMode] = useState(getModeFromHash);
  useEffect(() => {
    const onHash = () => setMode(getModeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (mode === "player") return <PlayerView />;
  if (mode === "host") {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Szepty Lasu — Panel Gospodarza</h1>
            <p className="mt-1 text-sm text-zinc-400">Dodaj graczy (z płcią), rozdaj postacie, wylosuj potwory, wyślij prywatne linki/QR.</p>
          </header>
          <HostLobby />
        </div>
        <WitcherDeck />
      </div>
    );
  }
  return <PlayerStart />;
}
