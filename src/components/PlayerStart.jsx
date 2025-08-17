// src/components/PlayerStart.jsx
import React, { useState } from "react";

export default function PlayerStart() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("female");

  return (
    <div className="start-screen">
      {/* Formularz na środku ekranu */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <form
          className="w-full max-w-md rounded-xl border border-zinc-700/60 bg-zinc-900/75 p-5 text-zinc-200 backdrop-blur"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="text-lg font-semibold">Podaj dane gracza</div>

          <label className="mt-4 block text-sm text-zinc-300">Imię i nazwisko</label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Julia Młodożeniak"
          />

          <label className="mt-4 block text-sm text-zinc-300">Płeć</label>
          <div className="mt-1 flex gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              Kobieta
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              Mężczyzna
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Wejdź
          </button>
        </form>
      </div>
    </div>
  );
}
