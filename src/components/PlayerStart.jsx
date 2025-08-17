import React, { useState } from "react";

export default function PlayerStart({ onConfirm }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("K"); // K / M

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm({ name: name.trim(), gender });
  };

  return (
    <div className="fixed inset-0 z-50">
      <img
        src="/assets/bg-start.jpg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[6px]" />

      <form
        onSubmit={submit}
        className="relative z-10 mx-auto mt-10 max-w-lg rounded-2xl border border-zinc-700/60 bg-zinc-900/70 p-5 text-zinc-100"
      >
        <h2 className="text-center text-lg font-semibold">Podaj dane gracza</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            className="sm:col-span-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="Imię i nazwisko"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="K">Kobieta</option>
            <option value="M">Mężczyzna</option>
          </select>
        </div>
        <div className="mt-4 flex justify-center">
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Dalej
          </button>
        </div>
      </form>
    </div>
  );
}
