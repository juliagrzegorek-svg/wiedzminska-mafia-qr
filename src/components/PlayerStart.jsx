import React, { useMemo, useState } from "react";
import CardFront from "./CardFront.jsx";
import { HEROES, abilityById } from "../data/gameData.js";

// pomoc: losowanie
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const b64urlEncode = (obj) => {
  const s = JSON.stringify(obj);
  const b = btoa(unescape(encodeURIComponent(s)));
  return b.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
};

export default function PlayerStart() {
  const [gender, setGender] = useState("K"); // K / M
  const [fullName, setFullName] = useState("");

  // listy jakie podałaś
  const femaleIds = ["filippa","margarita","shani","nenneke","triss","ciri","yennefer","keira","fringilla"];
  const maleIds   = ["vernon","jaskier","emhyr","zoltan","geralt","avallach"];

  const sampleHero = useMemo(() => {
    // karta „pokazowa” pod formularzem – Ciri, żeby widzieć, że cała jest ostra
    return HEROES.find(h => h.id === "ciri") || HEROES[0];
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const name = fullName.trim();
    if (!name) return;

    // wybór z puli wg płci
    const poolIds = (gender === "K" ? femaleIds : maleIds);
    const pool = HEROES.filter(h => poolIds.includes(h.id));
    const hero = pick(pool);

    // budujemy prywatny ładunek (bez serwera)
    const payload = {
      t: "player",
      gid: Math.random().toString(36).slice(2,7), // lokalne ID
      name,
      heroId: hero.id,
      monsterId: null, // potwory rozdajemy w trybie hosta
    };
    const hash = b64urlEncode(payload);
    window.location.hash = hash; // przełącz na widok gracza (PlayerView)
    window.scrollTo(0,0);
  };

  return (
    <div className="start-screen">
      {/* FORMULARZ */}
      <form className="start-form" onSubmit={onSubmit}>
        <div className="text-lg font-semibold mb-2">Podaj dane, aby wylosować postać</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className="col-span-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Imię i nazwisko"
            value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
          />
          <select
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            value={gender}
            onChange={(e)=>setGender(e.target.value)}
          >
            <option value="K">Kobieta</option>
            <option value="M">Mężczyzna</option>
          </select>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Losuj postać
          </button>
        </div>
      </form>

      {/* KARTA POD FORMULARZEM – W CAŁOŚCI WIDOCZNA */}
      <div className="card-slot">
        <CardFront
          imageUrl={sampleHero.image}
          name={sampleHero.name}
          role={sampleHero.baseAbilityId === "citizen" ? "Obywatel" : "Bohater"}
          ability={abilityById[sampleHero.baseAbilityId]?.description || ""}
        />
      </div>
    </div>
  );
}
