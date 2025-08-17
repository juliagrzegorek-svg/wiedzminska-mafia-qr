import React, { useState } from "react";
import { HEROES } from "../data/gameData.js";

// pule wg płci – dokładnie jak podałaś
const FEMALE = [
  "filippa", "margarita", "shani", "nenneke", "triss",
  "ciri", "yennefer", "keira", "fringilla",
];
const MALE = ["vernon", "jaskier", "emhyr", "zoltan", "geralt", "avallach"];

// prosty hash -> liczba (deterministyczny przydział z jednego QR)
function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
const encode = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export default function PlayerStart() {
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("K");

  const sp = new URLSearchParams(window.location.search);
  const gid = sp.get("gid") || "local";

  const onStart = (e) => {
    e.preventDefault();
    const clean = fullName.trim();
    if (!clean) return;

    const poolIds = sex === "K" ? FEMALE : MALE;
    const heroesById = Object.fromEntries(HEROES.map((h) => [h.id, h]));
    const idx = hash32((gid + "|" + clean + "|" + sex).toLowerCase()) % poolIds.length;
    const hero = heroesById[poolIds[idx]] || HEROES[0];

    const payload = {
      t: "player",
      gid,
      name: clean,
      heroId: hero.id,
      monsterId: null, // jeśli przyjdzie prywatny link z hosta, nadpisze to
    };
    const hash = encode(payload);
    window.location.assign(`${window.location.origin}/?flow=1#${hash}`);
  };

  return (
    <div
      className="min-h-screen bg-black text-zinc-100 relative"
      style={{
        backgroundImage: "url(/assets/bg-start.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "top center", // „wydłużone” od góry
      }}
    >
      {/* Górny pas z mocniejszym blur’em */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/85 via-black/55 to-transparent backdrop-blur-2xl" />
      {/* Całość z delikatnym gradientem/blur’em */}
      <div className="min-h-screen bg-gradient-to-b from-black/40 via-black/25 to-black/80 backdrop-blur-[2px] relative">
        <div className="mx-auto grid min-h-screen max-w-xl place-items-center px-4 py-10">
          <form
            onSubmit={onStart}
            className="w-full rounded-2xl border border-zinc-700/50 bg-zinc-900/85 p-5 shadow-2xl backdrop-blur"
          >
            <h1 className="text-center text-2xl font-bold">
              Dołącz do gry — Szepty Lasu
            </h1>
            <p className="mt-1 text-center text-sm text-zinc-300">
              Wpisz imię i nazwisko oraz wybierz płeć.
            </p>

            <label className="mt-4 block text-sm text-zinc-300">
              Imię i nazwisko
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-600"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="np. Julia Młodożeniak"
              autoFocus
            />

            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-zinc-300">Płeć:</span>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="sex"
                  value="K"
                  checked={sex === "K"}
                  onChange={() => setSex("K")}
                />
                Kobieta
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="sex"
                  value="M"
                  checked={sex === "M"}
                  onChange={() => setSex("M")}
                />
                Mężczyzna
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-500"
            >
              Odbierz swoją kartę
            </button>

            <p className="mt-3 text-center text-xs text-zinc-400">
              ID gry: <span className="font-mono">{gid}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
