// src/components/HostLobby.jsx
import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { HEROES, MONSTERS, abilityById } from "../data/gameData.js";

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

export default function HostLobby() {
  const [players, setPlayers] = useState([]); // {id,name}
  const [name, setName] = useState("");
  const [monstersCount, setMonstersCount] = useState(5);
  const [dealt, setDealt] = useState(null); // [{name, hero, monster?, link}]
  const gameId = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  const addPlayer = () => {
    const n = name.trim();
    if (!n) return;
    if (players.some((p) => p.name.toLowerCase() === n.toLowerCase())) return;
    setPlayers([...players, { id: crypto.randomUUID(), name: n }]);
    setName("");
  };
  const removePlayer = (id) => setPlayers(players.filter((p) => p.id !== id));

  const deal = () => {
    if (players.length === 0) return;

    // Rozdaj bohaterów (rotacyjnie jeśli graczy > bohaterów)
    const heroDeck = shuffle(HEROES);
    const assigned = players.map((p, i) => ({
      name: p.name,
      hero: heroDeck[i % heroDeck.length],
    }));

    // Losuj potwory — maks 5 (lub mniej jeśli graczy mniej)
    const mCount = Math.min(monstersCount, assigned.length);
    const idx = shuffle(assigned.map((_, i) => i)).slice(0, mCount);

    // Rozdaj typy potworów (z powtórkami, jeśli potrzeba)
    const monsterPool = [];
    for (let i = 0; i < mCount; i++)
      monsterPool.push(MONSTERS[i % MONSTERS.length]);
    const chosenTypes = shuffle(monsterPool);

    idx.forEach((i, k) => {
      assigned[i].monster = chosenTypes[k];
    });

    // Prywatne linki (ładunek w #hash)
    const withLinks = assigned.map((a) => {
      const payload = {
        t: "player",
        gid: gameId,
        name: a.name,
        heroId: a.hero.id,
        monsterId: a.monster?.id || null,
      };
      const hash = b64urlEncode(payload);
      const url = `${window.location.origin}/#${hash}`;
      return { ...a, link: url };
    });

    setDealt(withLinks);
  };

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="basis-2/3">
          <div className="text-lg font-semibold text-white">
            Gospodarz: lista graczy
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="w-64 max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię gracza"
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            />
            <button
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              onClick={addPlayer}
            >
              Dodaj
            </button>
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-zinc-700/60 bg-zinc-950 px-3 py-1.5 text-sm"
              >
                <span>{p.name}</span>
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
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200"
            />
            <button
              onClick={deal}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Rozdaj karty
            </button>
          </div>
        </div>

        <div className="basis-1/3 rounded-xl border border-zinc-700/60 bg-zinc-950 p-3">
          <div className="text-sm font-semibold text-white">Jak to działa?</div>
          <ol className="mt-2 list-inside list-decimal text-sm text-zinc-300">
            <li>Dodaj imiona graczy.</li>
            <li>Ustaw liczbę potworów (domyślnie 5).</li>
            <li>Kliknij <em>Rozdaj karty</em>.</li>
            <li>Każdemu graczowi wyślij jego <em>Link</em> lub pokaż <em>QR</em>. Link jest prywatny.</li>
          </ol>
        </div>
      </div>

      {dealt && (
        <div className="mt-5">
          <div className="mb-2 text-sm font-semibold text-zinc-200">
            Rozdane karty (tajne — wysyłaj linki):
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
                  const ability = abilityById[row.hero.baseAbilityId];
                  return (
                    <tr key={row.name} className="border-t border-zinc-800">
                      <td className="py-2 pr-3 font-medium text-zinc-200">
                        {row.name}
                      </td>
                      <td className="pr-3">{row.hero.name}</td>
                      <td className="pr-3 text-zinc-300">
                        {ability?.title || "—"}
                      </td>
                      <td className="pr-3">
                        {row.monster ? row.monster.name : "—"}
                      </td>
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
