// src/components/PlayerStart.jsx
import React, { useState } from "react";

export default function PlayerStart() {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("K"); // K lub M

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    // ... tu Twoja logika przejścia do karty
  };

  return (
    <div className="start-screen flex min-h-screen items-center justify-center px-4">
      {/* formularz jest NAD tłem i blurem */}
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700/60 bg-black/55 p-5 text-zinc-100 backdrop-blur-md"
      >
        <h1 className="mb-3 text-center text-xl font-semibold">
          Podaj dane gracza
        </h1>

        <label className="mb-1 block text-sm text-zinc-300">Imię i nazwisko</label>
        <input
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Julia Młodożeniak"
        />

        <fieldset className="mb-4">
          <legend className="mb-1 block text-sm text-zinc-300">Płeć</legend>
          <div className="flex gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="sex" value="K" checked={sex === "K"} onChange={() => setSex("K")} />
              Kobieta
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="sex" value="M" checked={sex === "M"} onChange={() => setSex("M")} />
              Mężczyzna
            </label>
          </div>
        </fieldset>

        <button type="submit" className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          Dalej
        </button>
      </form>
    </div>
  );
}
