import React, { useEffect, useState } from "react";
import PeelCard from "./PeelCard.jsx";
import AbilityCard from "./AbilityCard.jsx";
import OverlaySequence from "./OverlaySequence.jsx";
import PlayerStart from "./PlayerStart.jsx";
import { HEROES, MONSTERS, abilityById } from "../data/gameData.js";

const b64urlDecode = (hash) => {
  try {
    const b64 = hash.replace(/^#/, "").replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function PlayerView() {
  const payload = b64urlDecode(window.location.hash || "");

  const [startOpen, setStartOpen] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [abilityOpen, setAbilityOpen] = useState(false);
  const [heroClosed, setHeroClosed] = useState(false);
  const [monsterClosed, setMonsterClosed] = useState(false);

  useEffect(() => {
    // pokazujemy start-overlay tylko 1 raz na urządzeniu
    const ok = localStorage.getItem("wl-start-ok");
    if (ok) setStartOpen(false);
  }, []);

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

  const hero = HEROES.find((h) => h.id === payload.heroId);
  const monster = payload.monsterId ? MONSTERS.find((m) => m.id === payload.monsterId) : null;
  const ability = abilityById[hero?.baseAbilityId];

  const afterStart = () => {
    localStorage.setItem("wl-start-ok", "1");
    setStartOpen(false);
  };

  // po odłożeniu wszystkich kart pokaż sekwencję overlay + kartę zdolności
  useEffect(() => {
    if (startOpen) return;
    const bothDone = heroClosed && (monster ? monsterClosed : true);
    if (bothDone) setOverlayOpen(true);
  }, [startOpen, heroClosed, monsterClosed, monster]);

  return (
    <div className="mx-auto max-w-4xl p-4 text-zinc-200">
      {startOpen && <PlayerStart onConfirm={afterStart} />}

      <div className="mb-2 text-sm text-zinc-400">ID gry: <span className="font-mono">{payload.gid}</span></div>
      <h1 className="text-2xl font-bold">Twoje karty, {payload.name}:</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {hero && (
          <PeelCard
            title={hero.name}
            subtitle="Bohater"
            imageUrl={hero.image}
            onClose={() => setHeroClosed(true)}
          />
        )}
        {monster && (
          <PeelCard
            title={monster.name}
            subtitle="Potwór"
            imageUrl={monster.image}
            description={monster.description}
            onClose={() => setMonsterClosed(true)}
          />
        )}
      </div>

      {overlayOpen && (
        <OverlaySequence
          onDone={() => {
            setOverlayOpen(false);
            setAbilityOpen(true);
          }}
        />
      )}

      {abilityOpen && ability && (
        <div className="mt-6">
          <AbilityCard title={ability.title} description={ability.description} />
        </div>
      )}

      <div className="mt-6">
        <a href="/" className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          Zamknij (wróć)
        </a>
      </div>
    </div>
  );
}
