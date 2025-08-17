import React, { useMemo, useState } from "react";
import PeelCard from "./PeelCard.jsx";
import { ABILITIES, HEROES, MONSTERS, abilityById } from "../data/gameData.js";

const cls = (...xs) => xs.filter(Boolean).join(" ");
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const Mini = ({ title, subtitle }) => (
  <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
    <div className="font-semibold">{title}</div>
    {subtitle && <div className="text-zinc-400">{subtitle}</div>}
  </div>
);

const Drawer = ({ open, onClose, children }) => (
  <div className={cls("fixed inset-0 z-30 overflow-hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
    <div onClick={onClose} className={cls("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")} />
    <div className={cls("absolute bottom-0 left-0 right-0 max-h-[85%] rounded-t-3xl border-t border-zinc-700/60 bg-zinc-950 p-4 shadow-2xl transition-transform", open ? "translate-y-0" : "translate-y-full")} role="dialog" aria-modal="true">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  </div>
);

export default function WitcherDeck() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("heroes");
  const [mix, setMix] = useState(() => shuffle(ABILITIES));
  const [pairs, setPairs] = useState(null);

  const canonicalPairs = useMemo(() => HEROES.map((h) => ({
    heroId: h.id, heroName: h.name, abilityId: h.baseAbilityId, abilityTitle: abilityById[h.baseAbilityId]?.title ?? ""
  })), []);

  const makePairs = () => {
    const heroes = HEROES.filter((h) => h.baseAbilityId !== "citizen");
    const abilities = heroes.map((h) => h.baseAbilityId);
    const shuffled = shuffle(abilities);
    const p = heroes.map((h, i) => ({
      heroId: h.id,
      heroName: h.name,
      currentAbilityId: shuffled[i],
      currentAbilityTitle: abilityById[shuffled[i]].title,
      canonicalAbilityId: h.baseAbilityId,
      canonicalAbilityTitle: abilityById[h.baseAbilityId].title,
    }));
    setPairs(p);
    setTab("pairs");
  };

  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-b from-zinc-950 to-black p-4 text-zinc-200">
      <header className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Szepty Lasu — Talia ról i funkcji</h2>
        <p className="mt-1 text-sm text-zinc-400">Kanon + panel do „eliksiru” (pomieszanie funkcji).</p>
      </header>

      <section className="mx-auto mt-4 max-w-5xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {canonicalPairs.filter((p) => p.abilityId !== "citizen").map((p) => {
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
      </section>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 px-3 py-2 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-zinc-900"
        aria-label="Talia"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-90" fill="none">
          <rect x="3" y="5" width="14" height="16" rx="2" stroke="currentColor" />
          <rect x="7" y="3" width="14" height="16" rx="2" stroke="currentColor" className="-ml-2" />
        </svg>
        <span className="text-sm">Talia</span>
      </button>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="mb-4 flex flex-wrap gap-2">
          {["heroes","monsters","func","pairs"].map(k => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cls("rounded-xl border px-3 py-1.5 text-sm",
                tab===k ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            >
              {k==="heroes" && "Bohaterowie"}
              {k==="monsters" && "Potwory"}
              {k==="func" && "Funkcje (pomieszane)"}
              {k==="pairs" && "Pary (eliksir)"}
            </button>
          ))}
          <button onClick={makePairs} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">
            Eliksir → pary
          </button>
        </div>

        {tab==="heroes" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HEROES.map(h => (
              <PeelCard key={h.id} title={h.name} subtitle={h.baseAbilityId==="citizen"?"Obywatel":"Bohater"} imageUrl={h.image} description={abilityById[h.baseAbilityId]?.title || "—"} />
            ))}
          </div>
        )}

        {tab==="monsters" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MONSTERS.map(m => (
              <PeelCard key={m.id} title={m.name} subtitle="Potwór" imageUrl={m.image} description={m.description} />
            ))}
          </div>
        )}

        {tab==="func" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mix.map(a => (
              <PeelCard key={a.id} title={a.title} subtitle="Funkcja" imageUrl={null} description={a.description} />
            ))}
          </div>
        )}

        {tab==="pairs" && (
          !pairs ? <div className="text-sm text-zinc-400">Użyj „Eliksir → pary”.</div> :
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {pairs.map(p => {
              const hero = HEROES.find(h => h.id===p.heroId);
              return (
                <div key={p.heroId} className="grid grid-cols-2 items-center gap-3 rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-3">
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Aktualnie</div>
                    <Mini title={hero.name} subtitle={p.currentAbilityTitle} />
                  </div>
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Kanon</div>
                    <Mini title={hero.name} subtitle={p.canonicalAbilityTitle} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    </div>
  );
}
