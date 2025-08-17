import React from "react";
import CardFront from "./CardFront.jsx";
import { HEROES, MONSTERS, ABILITIES } from "../data/gameData.js";

const b64urlDecode = (hash) => {
  try {
    const b64 = (hash || "").replace(/^#/, "").replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const abilityTitleForHero = (hero) => {
  if (!hero) return "";
  const a = ABILITIES.find((x) => x.id === hero.baseAbilityId);
  return a?.title || (hero.baseAbilityId === "citizen" ? "Obywatel" : "");
};

export default function PlayerView() {
  const payload = b64urlDecode(window.location.hash);

  if (!payload || payload.t !== "player") {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-5 text-center text-zinc-200">
        <div className="text-lg font-semibold">Brak karty gracza</div>
        <p className="mt-2 text-sm text-zinc-400">
          Ten link nie zawiera informacji o graczu. Poproś gospodarza o nowy
          link lub wróć na stronę główną.
        </p>
        <a href="/" className="mt-4 inline-block rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          Wróć na stronę główną
        </a>
      </div>
    );
  }

  const hero = HEROES.find((h) => h.id === payload.heroId);
  const monster = payload.monsterId
    ? MONSTERS.find((m) => m.id === payload.monsterId)
    : null;

  const heroRole =
    hero?.baseAbilityId === "citizen" ? "Obywatel" : "Bohater";
  const heroAbility = abilityTitleForHero(hero);

  return (
    <div className="player-view">
      <div className="gid">ID gry: <span className="mono">{payload.gid}</span></div>
      <h1 className="title">Twoje karty, {payload.name}:</h1>

      <div className="cards-grid">
        {hero && (
          <CardFront
            imageUrl={hero.image}
            name={hero.name}
            role={heroRole}
            abilityTitle={heroAbility}
          />
        )}

        {monster && (
          <CardFront
            imageUrl={monster.image}
            name={monster.name}
            role="Potwór"
            abilityTitle={monster.description}
          />
        )}
      </div>

      <div className="back-line">
        <a href="/" className="back-btn">Zamknij (wróć)</a>
      </div>
    </div>
  );
}
