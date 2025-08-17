import React, { useState } from "react";

export default function PlayerStart() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("K");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    // zapamiętaj lokalnie – gospodarz i tak przydziela role
    localStorage.setItem("player:name", name.trim());
    localStorage.setItem("player:gender", gender);
    // Tu zostajesz – czekasz na link od hosta albo od razu
    // wróć do głównej (według Twojego flow).
    window.location.href = "/";
  };

  return (
    <div className="start-screen">
      <div className="start-glass">
        <h2>Podaj dane gracza</h2>
        <form onSubmit={submit} className="form">
          <label className="lbl">Imię i nazwisko</label>
          <input
            className="inp"
            placeholder="np. Julia Młodożeniak"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="lbl">Płeć</label>
          <div className="gender">
            <label className="radio">
              <input
                type="radio"
                name="g"
                value="K"
                checked={gender === "K"}
                onChange={() => setGender("K")}
              />
              <span>Kobieta</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="g"
                value="M"
                checked={gender === "M"}
                onChange={() => setGender("M")}
              />
              <span>Mężczyzna</span>
            </label>
          </div>

          <button className="enter">Wejdź</button>
        </form>
      </div>
    </div>
  );
}
