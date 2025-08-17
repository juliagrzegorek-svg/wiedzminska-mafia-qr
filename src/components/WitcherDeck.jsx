import React, { useMemo, useState } from "react";
import PeelCard from "./PeelCard.jsx";
import { ABILITIES, HEROES, MONSTERS, abilityById } from "../data/gameData.js";

const cls = (...xs) => xs.filter(Boolean).join(" ");
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const Drawer = ({ open, onClose, children }) => (
  <div className={cls("fixed inset-0 z-30 overflow-hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
    <div onClick={onClose} className={cls("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")} />
    <div className={cls("absolute bottom-0 left-0 right-0 max-h-[86%] rounded-t-3xl border-t border-zinc-700/60 bg-zinc-950 p-4 shadow-2xl transition-transform", open ? "translate-y-0" : "translate-y-full")} role="dialog" aria-modal="true">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  </div>
);

export default function WitcherDeck() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("heroes");

  const canonicalPairs = useMemo(
    () => HEROES.map((h) => ({ heroId: h.id, heroName: h.name, abilityId: h.baseAbilityId })),
    []
  );

  const citizensFirst = [...HEROES].sort((a, b) => {
    const ac = a.baseAbilityId === "citizen" ? -1 : 1;
    const bc = b.baseAbilityId === "citizen" ? -1 : 1;
    return ac - bc;
  });

  return (
    <div className="min-h-[60vh] w-full bg-gradient-to-b from-zinc-950 to-black p-4 text-zinc-200">
      {/* hamburger u góry lewo */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Menu kart"
        className="fixed left-4 top-4 z-40 rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-2 shadow backdrop-blur hover:bg-zinc-900"
      >
        <div className="space-y-1">
          <div className="h-0.5 w-5 bg-zinc-300" />
          <div className="h-0.5 w-5 bg-zinc-300" />
          <div className="h-0.5 w-5 bg-zinc-300" />
        </div>
      </button>

      <header className="mx-auto max-w-5xl pt-10">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          Szepty Lasu — Talia ról i funkcji
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Kanon: stałe przypisania ról. Z menu (☰) podejrzysz wszystkie karty.
        </p>
      </header>

      {/* „kanon” – przykładowe 3 karty na stronie gospodarza */}
      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {canonicalPairs
          .filter((p) => p.abilityId !== "citizen")
          .slice(0, 3)
          .map((p) => {
            const hero = HEROES.find((h) => h.id === p.heroId);
            return (
              <PeelCard
                key={p.heroId}
                title={hero.name}
                subtitle="Bohater"
                imageUrl={hero.image}
                description={abilityById[p.abilityId].title}
              />
            );
          })}
      </div>

      {/* Drawer z listami kart */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="mb-3 flex items-center gap-2">
          <button
            className={cls("rounded-lg border px-3 py-1.5 text-sm",
              tab === "heroes" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("heroes")}
          >Bohaterowie</button>
          <button
            className={cls("rounded-lg border px-3 py-1.5 text-sm",
              tab === "monsters" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("monsters")}
          >Potwory</button>
          <button
            className={cls("rounded-lg border px-3 py-1.5 text-sm",
              tab === "abilities" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("abilities")}
          >Zdolności</button>
        </div>

        {tab === "heroes" && (
          <div className="space-y-3 overflow-y-auto pb-8">
            {citizensFirst.map((h) => (
              <PeelCard
                key={h.id}
                title={h.name}
                subtitle={h.baseAbilityId === "citizen" ? "Obywatel" : "Bohater"}
                imageUrl={h.image}
                description={abilityById[h.baseAbilityId]?.title || "—"}
              />
            ))}
          </div>
        )}

        {tab === "monsters" && (
          <div className="space-y-3 overflow-y-auto pb-8">
            {MONSTERS.map((m) => (
              <PeelCard
                key={m.id}
                title={m.name}
                subtitle="Potwór"
                imageUrl={m.image}
                description={m.description}
              />
            ))}
          </div>
        )}

        {tab === "abilities" && (
          <div className="space-y-3 overflow-y-auto pb-8">
            {ABILITIES.map((a) => (
              <PeelCard key={a.id} title={a.title} subtitle="Funkcja" description={a.description} />
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
