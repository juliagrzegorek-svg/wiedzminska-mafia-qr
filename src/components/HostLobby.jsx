// src/components/HostLobby.jsx
import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { HEROES, MONSTERS, abilityById } from "../data/gameData.js";

// Pomocnicze
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const b64urlEncode = (obj) => {
  const s = JSON.stringify(obj);
  const b = btoa(unescape(encodeURIComponent(s)));
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Mapy ID bohaterów wg płci (dopasuj do swoich zasobów w gameData.js)
const FEMALE_IDS = [
  "filippa", "margarita", "shani", "nenneke", "triss",
  "ciri", "yennefer", "keira", "fringilla" /* jeśli masz w HEROES */
];
const MALE_IDS = [
  "vernon", "jaskier", "emhyr", "zoltan", "geralt",
  "avallach" /* jeśli masz w HEROES */
];

export default function HostLobby() {
  // Gracz: { id, name, sex: "K" | "M" }
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [monstersCount, setMonstersCount] = useState(5);

  // Wynik rozdania
  const [dealt, setDealt] = useState(null); // [{name, sex, hero, monster? , link}]
  const gameId = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  // Słowniki bohaterów wg płci na bazie HEROES (filtrowanie pod realnie istniejące ID)
  const femalePool = useMemo(
    () => FEMALE_IDS.map(id => HEROES.find(h => h.id === id)).filter(Boolean),
    []
  );
  const malePool = useMemo(
    () => MALE_IDS.map(id => HEROES.find(h => h.id === id)).filter(Boolean),
    []
  );

  const addPlayer = () => {
    const n = name.trim();
    if (!n) return;
    if (players.some(p => p.name.toLowerCase() === n.toLowerCase())) return;
    setPlayers(prev => [...prev, { id: crypto.randomUUID(), name: n, sex }]);
    setName("");
  };

  const removePlayer = (id) => setPlayers(players.filter(p => p.id !== id));

  const deal = () => {
    if (players.length === 0) return;

    // Pula wg płci
    const fDeck = shuffle(femalePool);
    const mDeck = shuffle(malePool);

    // Przypisz postać zgodnie z płcią (cyklicznie jeśli graczy > puli)
    const assigned = players.map((p, i) => {
      const hero =
        p.sex === "K"
          ? fDeck[i % Math.max(fDeck.length, 1)]
          : mDeck[i % Math.max(mDeck.length, 1)];
      return { name: p.name, sex: p.sex, hero };
    });

    // Losowo wybierz graczy, którzy dostaną potwory
    const mCount = Math.min(monstersCount, assigned.length);
    const indices = shuffle(assigned.map((_, i) => i)).slice(0, mCount);

    // Losuj typ potwora (z powtórkami jeśli > liczby różnych potworów)
    for (let k = 0; k < mCount; k++) {
      const idx = indices[k];
      const monster = MONSTERS[k % MONSTERS.length];
      assigned[idx].monster = monster;
    }

    // Zaszyj ładunek do linków graczy
    const withLinks = assigned.map((a) => {
      const payload = {
        t: "player",
        gid: gameId,
        name: a.name,
        heroId: a.hero?.id || null,
        monsterId: a.monster?.id || null,
      };
      const hash = b64urlEncode(payload);
      const url = `${window.location.origin}/#${hash}`;
      return { ...a, link: url };
    });

    setDealt(withLinks);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* LEWA KOLUMNA — gracze + rozdaj */}
        <div className="basis-2/3">
          <div className="text-lg font-semibold text-white">Gospodarz: lista graczy</div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              className="w-64 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię i nazwisko"
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            />
            <select
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-200"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              title="Płeć"
            >
              <option value="M">Mężczyzna</option>
              <option value="K">Kobieta</option>
            </select>
            <button
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              onClick={addPlayer}
            >
              Dodaj
            </button>
          </div>

          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-zinc-700/60 bg-zinc-950 px-3 py-1.5 text-sm"
              >
                <span>{p.name} — <span className="text-zinc-400">{p.sex}</span></span>
                <button
                  className="text-zinc-400 hover:text-red-400"
                  onClick={() => removePlayer(p.id)}
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-zinc-300">Liczba potworów:</label>
            <input
              type="number"
              min={0}
              max={20}
              value={monstersCount}
              onChange={(e) => setMonstersCount(Number(e.target.value || 0))}
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200"
            />
            <button
              onClick={deal}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Rozdaj karty
            </button>
          </div>
        </div>

        {/* PRAWA KOLUMNA — wspólny QR */}
        <div className="basis-1/3 rounded-xl border border-zinc-700/60 bg-zinc-950 p-3">
          <div className="text-sm font-semibold text-white">Wspólny QR dla graczy</div>
          <p className="mt-1 text-sm text-zinc-300">
            Niech wszyscy zeskanują <em>ten sam</em> kod — otworzy ekran startowy ze stołu
            (adres <code>/start</code>). To „samodzielny” tryb losowania.
          </p>

          <div className="mt-2 flex items-center justify-center rounded bg-white p-2">
            <QRCodeSVG value={`${origin}/start`} size={140} />
          </div>
          <button
            className="mt-2 w-full rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
            onClick={() => navigator.clipboard.writeText(`${origin}/start`)}
          >
            Kopiuj adres
          </button>

          <div className="mt-4 text-sm font-semibold text-white">Jak to działa?</div>
          <ol className="mt-1 list-inside list-decimal text-sm text-zinc-300">
            <li>Dodaj imiona graczy i ich płeć (dla dopasowania postaci).</li>
            <li>Ustaw liczbę potworów (domyślnie 5).</li>
            <li>Kliknij <em>Rozdaj karty</em>.</li>
            <li>Każdemu wyślij jego <em>Link</em> lub pokaż <em>QR</em> (to tryb kontrolowany).</li>
            <li>Wspólny QR to alternatywa — gracze sami losują po wejściu na <code>/start</code>.</li>
          </ol>
        </div>
      </div>

      {/* Tabela wyników rozdania */}
      {dealt && (
        <div className="mt-5">
          <div className="mb-2 text-sm font-semibold text-zinc-200">
            Rozdane karty (tajne linki/QR — każdy widzi tylko swoje):
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="py-2">Gracz</th>
                  <th>Postać</th>
                  <th>Funkcja</th>
                  <th>Potwór?</th>
                  <th>Link</th>
                  <th>QR</th>
                </tr>
              </thead>
              <tbody>
                {dealt.map((row) => {
                  const ability = row.hero ? abilityById[row.hero.baseAbilityId] : null;
                  return (
                    <tr key={row.name} className="border-t border-zinc-800">
                      <td className="py-2 pr-3 font-medium text-zinc-200">
                        {row.name} — <span className="text-zinc-400">{row.sex}</span>
                      </td>
                      <td className="pr-3">{row.hero?.name || "—"}</td>
                      <td className="pr-3 text-zinc-300">{ability?.title || "—"}</td>
                      <td className="pr-3">{row.monster ? row.monster.name : "—"}</td>
                      <td className="pr-3">
                        <button
                          className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
                          onClick={() => navigator.clipboard.writeText(row.link)}
                        >
                          Kopiuj link
                        </button>
                      </td>
                      <td className="py-2">
                        <div className="inline-block rounded bg-white p-1">
                          <QRCodeSVG value={row.link} size={72} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
