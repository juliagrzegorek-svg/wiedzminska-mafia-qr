import React, { useMemo, useState } from "react";
import PeelCard from "./PeelCard.jsx";
import PlayerStart from "./PlayerStart.jsx";
import OverlaySequence from "./OverlaySequence.jsx";
import AbilityCard from "./AbilityCard.jsx";
import { HEROES, MONSTERS, abilityById } from "../data/gameData.js";

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
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState(() => ({ name: payload?.name || "", gender: "auto" }));

  const hero = useMemo(
    () => (payload ? HEROES.find((h) => h.id === payload.heroId) : null),
    [payload]
  );
  const monster = useMemo(
    () => (payload?.monsterId ? MONSTERS.find((m) => m.id === payload.monsterId) : null),
    [payload]
  );

  const [placedHero, setPlacedHero] = useState(false);
  const [placedMonster, setPlacedMonster] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAbility, setShowAbility] = useState(false);

  // po odłożeniu kart wyświetl overlay
  const tryOverlay = (ph, pm) => {
    const heroDone = ph || placedHero;
    const monDone = (monster ? (pm || placedMonster) : true);
    if (heroDone && monDone) setShowOverlay(true);
  };

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

  if (!started) {
    return (
      <PlayerStart
        initialName={player.name}
        onStart={({ name, gender }) => {
          setPlayer({ name, gender });
          setStarted(true);
        }}
      />
    );
  }

  const abilityTitle =
    hero?.baseAbilityId && hero.baseAbilityId !== "citizen"
      ? abilityById[hero.baseAbilityId]?.title || ""
      : "Obywatel";

  const abilityDesc =
    hero?.baseAbilityId && hero.baseAbilityId !== "citizen"
      ? abilityById[hero.baseAbilityId]?.description || ""
      : "";

  return (
    <div className="mx-auto max-w-4xl p-4 text-zinc-200">
      <div className="mb-3 text-sm text-zinc-400">
        ID gry: <span className="font-mono">{payload.gid}</span>
      </div>
      <h1 className="text-2xl font-bold">Twoje karty, {player.name}:</h1>

      {/* KARTY DO ODKRYCIA */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {hero && (
          <PeelCard
            title={hero.name}
            subtitle="Bohater"
            imageUrl={hero.image}
            description=""
            onPlace={() => {
              setPlacedHero(true);
              tryOverlay(true, false);
            }}
          />
        )}
        {monster && (
          <PeelCard
            title={monster.name}
            subtitle="Potwór"
            imageUrl={monster.image}
            description={monster.description}
            onPlace={() => {
              setPlacedMonster(true);
              tryOverlay(false, true);
            }}
          />
        )}
      </div>

      {/* Po odłożeniu kart */}
      {showOverlay && (
        <OverlaySequence
          onDone={() => {
            setShowOverlay(false);
            setShowAbility(true);
          }}
        />
      )}

      {/* Zdolność po „eliksirze” / lub kanoniczna */}
      {showAbility && (
        <div className="mx-auto mt-5 max-w-xl">
          <AbilityCard title={`Zdolność: ${abilityTitle}`} description={abilityDesc} />
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
