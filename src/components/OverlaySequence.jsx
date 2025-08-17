import React, { useEffect, useState } from "react";

export default function OverlaySequence({ onDone }) {
  const [phase, setPhase] = useState(0); // 0: alert, 1: typing, 2: end
  const [typed, setTyped] = useState("");
  const msg =
    "W dzisiejszym jedzeniu wykryto eliksir, który pomieszał zdolności bohaterów. Czy Yen to naprawdę Yen? Czy Emhyr wciąż może okazać łaskę?";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 4000); // 4 s „Ludzie uważajcie!”
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) {
        clearInterval(id);
        setTimeout(() => setPhase(2), 600);
      }
    }, 24);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 2) {
      const t = setTimeout(onDone, 200);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div className="fixed inset-0 z-50 overlay-dim text-zinc-100">
      <div className="absolute inset-0 grid place-items-center">
        {phase === 0 ? (
          <div className="text-3xl font-extrabold tracking-wide">Ludzie uważajcie!</div>
        ) : (
          <div className="max-w-2xl px-6 text-center text-lg leading-relaxed">{typed}</div>
        )}
      </div>
    </div>
  );
}
