// src/components/PlayerStart.jsx
import React, { useMemo, useState } from "react";
import { HEROES } from "../data/gameData.js";

const FEMALES = ["filippa","margarita","shani","nenneke","triss","ciri","yennefer","keira","fringilla"].filter(Boolean);
const MALES   = ["vernon","jaskier","emhyr","zoltan","geralt","avallach"].filter(Boolean);

const b64urlEncode = (obj) => {
  const s = JSON.stringify(obj);
  const b = btoa(unescape(encodeURIComponent(s)));
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export default function PlayerStart() {
  const [name, setName] = useState("");
  const [sex, setSex]   = useState("K");

  // id gry (opcjonalny seed z ?gid=xxx, albo generowany lokalnie)
  const gid = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get("gid") || Math.random().toString(36).slice(2, 8);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const poolIds = sex === "K" ? FEMALES : MALES;
    const pool = HEROES.filter(h => poolIds.includes(h.id));
    const hero = pool[Math.floor(Math.random() * pool.length)];
    if (!hero) return;

    const payload = {
      t: "player",
      gid,
      name: name.trim() || "Gracz",
      heroId: hero.id,
      monsterId: null,             // potwory – dalej przez hosta (tryb kontrolowany)
    };
    const hash = b64urlEncode(payload);
    window.location.href = `/#${hash}`;
  };

  return (
    <div className="start-screen flex items-start justify-center p-5">
      <form className="start-card mt-16 w-full" onSubmit={submit}>
        <h1 className="mb-1 text-2xl font-semibold text-white">Szepty Lasu — Start</h1>
        <p className="mb-4 text-sm text-zinc-300">
          Wpisz swoje imię i nazwisko oraz wybierz płeć. Otrzymasz kartę bohatera.
        </p>

        <label className="block text-sm text-zinc-200">Imię i nazwisko</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-600"
          placeholder="np. Julia Młodożeniak"
          value={name} onChange={(e)=>setName(e.target.value)}
          required
        />

        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-zinc-200">Płeć:</label>
          <label className="inline-flex items-center gap-2 text-zinc-200">
            <input type="radio" name="sex" value="K" checked={sex==="K"} onChange={()=>setSex("K")} /> Kobieta
          </label>
          <label className="inline-flex items-center gap-2 text-zinc-200">
            <input type="radio" name="sex" value="M" checked={sex==="M"} onChange={()=>setSex("M")} /> Mężczyzna
          </label>
        </div>

        <button type="submit"
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-500">
          Start
        </button>

        <p className="mt-2 text-[12px] text-zinc-400">
          Ten tryb działa ze **wspólnego QR**. Jeśli chcesz rozdać bez duplikatów
          i przydzielić potwory – użyj panelu gospodarza.
        </p>
      </form>
    </div>
  );
}
