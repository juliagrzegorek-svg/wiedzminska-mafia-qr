import React, { useState } from "react";

export default function PlayerStart({ onSubmit }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("F"); // F/M

  const handle = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    // jeśli nie podasz onSubmit, zachowamy tylko dane lokalnie, a host i tak rozda link
    try {
      sessionStorage.setItem("playerName", trimmed);
      sessionStorage.setItem("playerGender", gender);
    } catch {}

    if (onSubmit) onSubmit({ name: trimmed, gender });
    // nic nie zmieniamy w routingu – to ekran powitalny po wspólnym QR
  };

  return (
    <div className="start-screen">
      <form className="start-card" onSubmit={handle}>
        <h2>Podaj dane gracza</h2>

        <label className="label">Imię i nazwisko</label>
        <input
          className="input"
          placeholder="np. Julia Młodożeniak"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="label mt-3">Płeć</div>
        <div className="row">
          <label className="radio">
            <input
              type="radio"
              name="gender"
              checked={gender === "F"}
              onChange={() => setGender("F")}
            />
            <span>Kobieta</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="gender"
              checked={gender === "M"}
              onChange={() => setGender("M")}
            />
            <span>Mężczyzna</span>
          </label>
        </div>

        <button className="cta" type="submit">Wejdź</button>
      </form>
    </div>
  );
}
