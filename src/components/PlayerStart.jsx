import React, { useState } from "react";
import { HEROES } from "../data/gameData.js";

// pule wg płci – tak jak ustaliłaś
const FEMALE = [
  "filippa","margarita","shani","nenneke","triss",
  "ciri","yennefer","keira","fringilla",
];
const MALE = ["vernon","jaskier","emhyr","zoltan","geralt","avallach"];

// deterministyczny „los”— ten sam gracz z tym samym gid dostanie to samo
function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
const encode = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export default function PlayerStart() {
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("K"); // K / M

  // z linku wspólnego QR: ?join=1&gid=ABCD12
  const sp = new URLSearchParams(window.location.search);
  const gid = sp.get("gid") || "local";

  const onStart = (e) => {
    e.preventDefault();
    const clean = fullName.trim();
    if (!clean) return;

    const poolIds = sex === "K" ? FEMALE : MALE;
    const byId = Object.fromEntries(HEROES.map(h => [h.id, h]));
    const idx = hash32((gid + "|" + clean + "|" + sex).toLowerCase()) % poolIds.length;
    const hero = byId[poolIds[idx]] || HEROES[0];

    const payload = { t: "player", gid, name: clean, heroId: hero.id, monsterId: null };
    const hash = encode(payload);

    // przejście do ekranu karty z animacjami
    window.location.assign(`${window.location.origin}/?flow=1#${hash}`);
  };

  return (
    <div className="start-screen flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onStart}
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700/60 bg-black/55 p-5 text-zinc-100 backdrop-blur-md">
        <h1 className="mb-1 text-center text-2xl font-bold">Dołącz do gry</h1>
        <p className="mb-4 text-center text-sm text-zinc-300">Wpisz imię i nazwisko oraz wybierz płeć.</p>

        <label className="mb-1 block text-sm text-zinc-300">Imię i nazwisko</label>
        <input
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="np. Julia Młodożeniak"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoFocus
        />

        <fieldset className="mb-4">
          <legend className="mb-1 block text-sm text-zinc-300">Płeć</legend>
          <div className="flex gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="sex" value="K" checked={sex === "K"} onChange={() => setSex("K")} /> Kobieta
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="sex" value="M" checked={sex === "M"} onChange={() => setSex("M")} /> Mężczyzna
            </label>
          </div>
        </fieldset>

        <button type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          Odbierz swoją kartę
        </button>

        <p className="mt-3 text-center text-xs text-zinc-400">
          ID gry: <span className="font-mono">{gid}</span>
        </p>
      </form>
    </div>
  );
}
