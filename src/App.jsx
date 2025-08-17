// src/App.jsx
import React, { useEffect, useState } from "react";
import HostLobby from "./components/HostLobby.jsx";
import PlayerView from "./components/PlayerView.jsx";
import PlayerStart from "./components/PlayerStart.jsx";

function getMode() {
  const sp = new URLSearchParams(window.location.search);
  if (sp.get("join") === "1") return "start";   // ekran startu z tłem
  if (window.location.hash) return "player";    // prywatny link z kartą
  return "host";                                // pokój gospodarza
}

export default function App() {
  const [mode, setMode] = useState(getMode);
  useEffect(() => {
    const onChange = () => setMode(getMode());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  if (mode === "start") return <PlayerStart />;
  if (mode === "player") return <PlayerView />;

  // HOST domyślnie
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-2 text-3xl font-bold text-white">Szepty Lasu — Wiedźmińska Mafia</h1>
        <HostLobby />
      </div>
    </div>
  );
}
