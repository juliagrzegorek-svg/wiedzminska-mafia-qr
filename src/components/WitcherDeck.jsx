import React, { useMemo, useState } from "react";

const cls = (...xs) => xs.filter(Boolean).join(" ");
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ABILITIES = [
  {
    id: "yen-doctor",
    title: "Yennefer — Uzdrowicielka",
    description:
      "KAŻDEJ NOCY — budzisz się PRZED mafią i wskazujesz jedną osobę do ochrony. Jeśli zostanie zaatakowana, atak nie dochodzi do skutku. Możesz uratować SIEBIE i przetrwać noc.",
  },
  {
    id: "seer",
    title: "Geralt/Ciri — Jasnowidz(owie)",
    description:
      "KAŻDEJ NOCY — budzisz się PIERWSZY/A (lub naprzemiennie) i poznajesz frakcję wybranego gracza (mieszczanin/potwór). Wiedzę wykorzystujesz w dzień.",
  },
  {
    id: "filippa-revive",
    title: "Filippa Eilhart — Wskrzeszenie",
    description:
      "RAZ NA GRĘ — w DZIEŃ możesz ujawnić się i wskrzesić jedną wyeliminowaną osobę. Wraca do gry natychmiast.",
  },
  {
    id: "bard-cancel-vote",
    title: "Jaskier — Ballada",
    description:
      "RAZ NA GRĘ — możesz zaśpiewać balladę: głosowanie w ciągu dnia zostaje ANULOWANE.",
  },
  {
    id: "zoltan-shield-village",
    title: "Zoltan — Tarcza Wioski",
    description:
      "RAZ NA GRĘ — chronisz CAŁĄ wioskę na jedną noc. Atak potworów tej nocy NIE dochodzi do skutku.",
  },
  {
    id: "nenneke-antivamp",
    title: "Nenneke — Uleczenie Ugryzienia",
    description:
      "PIERWSZEJ NOCY — wybierasz jedną osobę; jeśli została ugryziona przez Wampira, LECZYSZ ugryzienie (nie umrze następnej nocy).",
  },
  {
    id: "emhyr-governor",
    title: "Emhyr — Łaska Cesarza",
    description:
      "RAZ NA GRĘ — możesz uratować wybraną osobę z egzekucji po głosowaniu ludu (anulujesz egzekucję).",
  },
  {
    id: "citizen",
    title: "Obywatel",
    description: "Brak mocy specjalnej. Cel: przetrwać i pomóc wiosce pokonać potwory.",
  },
];

const HEROES = [
  { id: "yennefer", name: "Yennefer", baseAbilityId: "yen-doctor" },
  { id: "geralt", name: "Geralt", baseAbilityId: "seer" },
  { id: "ciri", name: "Ciri", baseAbilityId: "seer" },
  { id: "filippa", name: "Filippa Eilhart", baseAbilityId: "filippa-revive" },
  { id: "jaskier", name: "Jaskier (Bard)", baseAbilityId: "bard-cancel-vote" },
  { id: "zoltan", name: "Zoltan (Krasnolud)", baseAbilityId: "zoltan-shield-village" },
  { id: "nenneke", name: "Nenneke", baseAbilityId: "nenneke-antivamp" },
  { id: "emhyr", name: "Emhyr", baseAbilityId: "emhyr-governor" },
  // pozostali obywatele:
  { id: "vernon", name: "Vernon", baseAbilityId: "citizen" },
  { id: "keira", name: "Keira", baseAbilityId: "citizen" },
  { id: "margarita", name: "Margarita", baseAbilityId: "citizen" },
  { id: "fringilla", name: "Fringilla", baseAbilityId: "citizen" },
  { id: "sabrina", name: "Sabrina", baseAbilityId: "citizen" },
  { id: "milva", name: "Milva", baseAbilityId: "citizen" },
  { id: "avallach", name: "Avallac'h", baseAbilityId: "citizen" },
];

const MONSTERS = [
  {
    id: "vampire",
    name: "Wampir",
    description:
      "Założyciel Mrocznego Kręgu. PIERWSZEJ NOCY dokonuje rytuału i gryzie ofiarę — ta osoba UMRZE drugiej nocy (chyba że wyleczona). Cel: zabić bohaterów i wieśniaków.",
  },
  {
    id: "strzyga",
    name: "Strzyga",
    description:
      "NOCĄ bierze udział w wyborze ofiary razem z potworami. Cel: wyeliminować wszystkich dobrych.",
  },
  {
    id: "werewolf",
    name: "Wilkołak",
    description:
      "NOCĄ bierze udział w wyborze ofiary razem z potworami. Cel: wyeliminować wszystkich dobrych.",
  },
  {
    id: "bruxa",
    name: "Bruxa",
    description:
      "NOCĄ bierze udział w wyborze ofiary razem z potworami. Cel: wyeliminować wszystkich dobrych.",
  },
];

const abilityById = Object.fromEntries(ABILITIES.map((a) => [a.id, a]));
const CANON_ABILITY_IDS = Array.from(new Set(HEROES.map((h) => h.baseAbilityId)));

const Badge = ({ children }) => (
  <span className="inline-block rounded-full border border-zinc-500/30 bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-200">
    {children}
  </span>
);

const Card = ({ title, subtitle, children }) => (
  <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-4 shadow-sm transition hover:shadow-md">
    <div>
      <div className="mb-1 text-sm font-semibold text-zinc-100">{title}</div>
      {subtitle && <div className="mb-2 text-xs text-zinc-400">{subtitle}</div>}
      <div className="text-sm text-zinc-300">{children}</div>
    </div>
  </div>
);

const MiniCard = ({ title, subtitle }) => (
  <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200">
    <div className="font-semibold">{title}</div>
    {subtitle && <div className="text-zinc-400">{subtitle}</div>}
  </div>
);

const Section = ({ title, right, children }) => (
  <section className="mt-6">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {right}
    </div>
    {children}
  </section>
);

const DeckButton = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Otwórz talię"
    className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 px-3 py-2 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-zinc-900"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
      <rect x="3" y="5" width="14" height="16" rx="2" stroke="currentColor"/>
      <rect x="7" y="3" width="14" height="16" rx="2" stroke="currentColor" className="-ml-2"/>
    </svg>
    <span className="text-sm">Talia</span>
  </button>
);

const Drawer = ({ open, onClose, children }) => (
  <div className={cls("fixed inset-0 z-30 overflow-hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
    <div
      onClick={onClose}
      className={cls("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")}
    />
    <div
      className={cls(
        "absolute bottom-0 left-0 right-0 max-h-[85%] rounded-t-3xl border-t border-zinc-700/60 bg-zinc-950 p-4 shadow-2xl transition-transform",
        open ? "translate-y-0" : "translate-y-full"
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-semibold text-zinc-100">Talia gry</div>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700/60 px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Zamknij
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default function WitcherDeck() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("heroes");
  const [shuffledFunctions, setShuffledFunctions] = useState(() => shuffle(ABILITIES));
  const [elixirPairs, setElixirPairs] = useState(null);

  const canonicalPairs = useMemo(
    () => HEROES.map((h) => ({
      heroId: h.id,
      heroName: h.name,
      abilityId: h.baseAbilityId,
      abilityTitle: ABILITIES.find(a => a.id === h.baseAbilityId)?.title ?? "",
    })),
    []
  );

  const makeElixirPairs = () => {
    const heroesWithAbility = HEROES.filter((h) => h.baseAbilityId !== "citizen");
    const abilities = heroesWithAbility.map((h) => h.baseAbilityId);
    const shuffled = shuffle(abilities);

    const pairs = heroesWithAbility.map((h, i) => ({
      heroId: h.id,
      heroName: h.name,
      currentAbilityId: shuffled[i],
      currentAbilityTitle: ABILITIES.find(a => a.id === shuffled[i]).title,
      canonicalAbilityId: h.baseAbilityId,
      canonicalAbilityTitle: ABILITIES.find(a => a.id === h.baseAbilityId).title,
    }));
    setElixirPairs(pairs);
    setTab("pairs");
  };

  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-b from-zinc-950 to-black p-4 text-zinc-200">
      <header className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Szepty Lasu — Talia ról i funkcji
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Kanon: stałe przypisania ról. W scenariuszu z eliksirem funkcje zostają pomieszane —
          porównasz pary w panelu talii.
        </p>
      </header>

      <Section title="Kanon: przypisania bohater → funkcja">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {canonicalPairs.filter((p) => p.abilityId !== "citizen").map((p) => (
            <Card key={p.heroId} title={p.heroName} subtitle="Bohater">
              <div className="mt-2">
                <Badge>{p.abilityTitle}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <DeckButton onClick={() => setOpen(true)} />

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            className={cls("rounded-xl border px-3 py-1.5 text-sm", tab === "heroes" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("heroes")}
          >
            Bohaterowie
          </button>
          <button
            className={cls("rounded-xl border px-3 py-1.5 text-sm", tab === "monsters" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("monsters")}
          >
            Potwory
          </button>
          <button
            className={cls("rounded-xl border px-3 py-1.5 text-sm", tab === "functions" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("functions")}
          >
            Funkcje (pomieszane)
          </button>
          <button
            className={cls("rounded-xl border px-3 py-1.5 text-sm", tab === "pairs" ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-700 bg-zinc-900 text-zinc-300")}
            onClick={() => setTab("pairs")}
          >
            Parowanie (eliksir)
          </button>
        </div>

        {tab === "heroes" && (
          <Section title="Bohaterowie">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HEROES.map((h) => (
                <Card key={h.id} title={h.name} subtitle={h.baseAbilityId === "citizen" ? "Obywatel" : "Bohater"}>
                  <div className="mt-2 text-sm">
                    <span className="text-zinc-400">Funkcja: </span>
                    <span className="font-medium">{ABILITIES.find(a => a.id === h.baseAbilityId)?.title || "—"}</span>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {tab === "monsters" && (
          <Section title="Potwory">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MONSTERS.map((m) => (
                <Card key={m.id} title={m.name} subtitle="Potwór">{m.description}</Card>
              ))}
            </div>
          </Section>
        )}

        {tab === "functions" && (
          <Section
            title="Funkcje (pomieszane, żeby utrudnić)"
            right={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShuffledFunctions(shuffle(ABILITIES))}
                  className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-sm hover:bg-zinc-900"
                >
                  Pomieszaj ponownie
                </button>
                <button
                  onClick={makeElixirPairs}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Uruchom scenariusz eliksiru → Pary
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shuffledFunctions.map((a) => (
                <Card key={a.id} title={a.title} subtitle="Funkcja">{a.description}</Card>
              ))}
            </div>
          </Section>
        )}

        {tab === "pairs" && (
          <Section
            title="Parowanie: po LEWEJ — aktualne po eliksirze, po PRAWEJ — właściwe (kanon)"
            right={
              <button
                onClick={makeElixirPairs}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Pomieszaj jeszcze raz
              </button>
            }
          >
            {!elixirPairs ? (
              <div className="text-sm text-zinc-400">Kliknij „Uruchom scenariusz eliksiru”, aby zobaczyć pary.</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {elixirPairs.map((p) => (
                  <div key={p.heroId} className="grid grid-cols-2 items-center gap-3 rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-3">
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Aktualnie (po eliksirze)</div>
                      <MiniCard title={p.heroName} subtitle={p.currentAbilityTitle} />
                    </div>
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wide text-zinc-400">Kanon (właściwe)</div>
                      <MiniCard title={p.heroName} subtitle={p.canonicalAbilityTitle} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}
      </Drawer>
    </div>
  );
}
