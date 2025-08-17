// src/components/PlayerView.jsx
import React from "react";
import PeelCard from "./PeelCard.jsx";
import { HEROES, MONSTERS } from "../data/gameData.js";

const b64urlDecode = (hash) => {
  try {
    const b64 = (hash || "").replace(/^#/, "").replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function PlayerView() {
  const payload = b64urlDecode(window.location.hash || "");
  if (!payload || payload.t !== "player") {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-5 text-center text-zinc-200">
        <div className="text-lg font-semibold">Brak karty gracza</div>
        <p className="mt-2 text-sm text-zinc-400">
          Ten link nie zawiera informacji o graczu. Poproś gospodarza o nowy link.
        </p>
        <a href="/" className="mt-4 inline-block rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          Wróć na stronę główną
        </a>
      </div>
    );
  }

  const hero = HEROES.find((h) => h.id === payload.heroId) || null;
  const monster = payload.monsterId ? MONSTERS.find((m) => m.id === payload.monsterId) : null;

  return (
    <div className="mx-auto max-w-4xl p-4 text-zinc-200">
      <div className="mb-4 text-sm text-zinc-400">
        ID gry: <span className="font-mono">{payload.gid}</span>
      </div>
      <h1 className="text-2xl font-bold">Twoje karty, {payload.name}:</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {hero && (
          <PeelCard
            title={hero.name}
            subtitle="Bohater"
            imageUrl={hero.image}
            description=""           // opis na karcie bohatera (zostawiamy pusty)
          />
        )}
        {monster && (
          <PeelCard
            title={monster.name}
            subtitle="Potwór"
            imageUrl={monster.image}
            description={monster.description}
          />
        )}
      </div>

      <div className="mt-6">
        <a href="/" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          Zamknij (wróć)
        </a>
      </div>
    </div>
  );
}
