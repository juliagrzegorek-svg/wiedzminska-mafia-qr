import React, { useEffect, useState } from "react";

export default function OverlaySequence({ onDone }) {
  const [phase, setPhase] = useState(0); // 0 -> tytuł, 1 -> pisanie
  const full =
    "W dzisiejszym jedzeniu został wykryty eliksir, który sprawił, że zdolności bohaterów pomieszały się. Czy Yen to Yen? Czy Emhyr wciąż może okazać łaskę?";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1600); // „Ludzie uważajcie!” ~1.6s
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    let i = 0;
    const iv = setInterval(() => {
      setTyped((s) => (i < full.length ? full.slice(0, ++i) : s));
      if (i >= full.length) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center backdrop-blur-[8px]"
      onClick={() => onDone && onDone()}
    >
      <div className="absolute inset-0 bg-black/70" />

      {phase === 0 ? (
        <div className="relative z-10 text-center">
          <div className="text-3xl font-extrabold tracking-wide text-white">Ludzie uważajcie!</div>
        </div>
      ) : (
        <div className="relative z-10 max-w-2xl rounded-2xl border border-zinc-600/50 bg-zinc-900/70 p-5 text-zinc-100 shadow-2xl">
          <div className="text-sm leading-relaxed">
            {typed}
            <span className="ml-1 inline-block animate-pulse">▌</span>
          </div>
          <div className="mt-4 text-center text-xs text-zinc-400">
            Kliknij, aby kontynuować
          </div>
        </div>
      )}
    </div>
  );
}
