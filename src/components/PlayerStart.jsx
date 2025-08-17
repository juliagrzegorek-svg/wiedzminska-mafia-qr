import React, { useState, useEffect } from "react";

export default function PlayerStart({ initialName = "", onStart }) {
  const [name, setName] = useState(initialName || "");
  const [gender, setGender] = useState("auto"); // auto/kobieta/mezczyzna
  const disabled = !name.trim();

  useEffect(() => {
    if (!initialName) return;
    setName(initialName);
  }, [initialName]);

  return (
    <div className="relative min-h-screen text-zinc-100">
      <img
        src="/assets/bg-start.jpg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0">
        <div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
          <h2 className="mb-3 text-center text-lg font-semibold">Witaj w grze</h2>
          <label className="mb-2 block text-xs text-zinc-300">Imię i nazwisko</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="np. Ciri z Cintry"
          />

          <label className="mb-2 block text-xs text-zinc-300">Płeć (do doboru postaci)</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mb-5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          >
            <option value="auto">Automatycznie</option>
            <option value="kobieta">Kobieta</option>
            <option value="mezczyzna">Mężczyzna</option>
          </select>

          <button
            disabled={disabled}
            onClick={() => onStart({ name: name.trim(), gender })}
            className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Wejdź do gry
          </button>
        </div>
      </div>
    </div>
  );
}
