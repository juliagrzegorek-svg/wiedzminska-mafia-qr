// src/components/PeelCard.jsx
import React, { useRef, useState } from "react";
import CardFront from "./CardFront.jsx";

export default function PeelCard({
  title,         // np. "Ciri"          (zachowuję stare API dla zgodności)
  subtitle,      // np. "Jasnowidzka"
  description,   // np. pełny opis zdolności (skrót też OK)
  imageUrl,      // portret
}) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    setDragging(true);
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = Math.abs(e.clientX - start.current.x);
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx + dy > 12) setOpen(true);
  };
  const onPointerUp = () => setDragging(false);

  return (
    <div className="group relative">
      <div
        className="relative w-full [perspective:1200px]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* FLIP */}
        <div
          className="
            relative h-full w-full transition-transform duration-500
            [transform-style:preserve-3d]
          "
          style={{ transform: `rotateY(${open ? 0 : 180}deg)` }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <CardFront
              name={title}
              role={subtitle}
              abilityText={description}
              imageUrl={imageUrl}
            />
          </div>

          {/* BACK / rewers */}
          <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div
              className="
                aspect-[2/3] w-full rounded-2xl
                border border-zinc-700/60
                bg-[linear-gradient(180deg,#0b0b0b_0%,#000_100%)]
              "
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-xl border border-zinc-700/60 px-3 py-1 text-xs tracking-wider text-zinc-300">
                  Odkryj kartę
                </div>
              </div>

              {/* Róg do „pociągnięcia” */}
              <button
                className="
                  absolute bottom-2 right-2 h-10 w-10 rounded-lg
                  border border-zinc-700/60 bg-zinc-900/70 text-zinc-200
                  shadow hover:bg-zinc-800 active:scale-95
                "
                onPointerDown={onPointerDown}
                onClick={() => setOpen(true)}
                title="Pociągnij/kliknij, by odkryć"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" className="mx-auto opacity-80">
                  <path d="M6 18c6 0 12-6 12-12v12H6z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Przycisk pomocniczy pod kartą */}
      {open && (
        <div className="mt-2">
          <button
            className="rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
            onClick={() => setOpen(false)}
          >
            Odłóż kartę na stół
          </button>
        </div>
      )}
    </div>
  );
}
