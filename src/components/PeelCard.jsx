import React, { useRef, useState } from "react";

/**
 * PeelCard — karta z animacją “odkrycia”.
 * Front: turkus + złota ramka + portret + dolna tabliczka z liniami tekstu.
 * Props:
 *  - title        (np. "Ciri")
 *  - subtitle     (np. "Bohater" / "Potwór")
 *  - imageUrl     (portret)
 *  - description  (treść zdolności — podamy jako 3. linia, jeśli niepusta)
 *  - showAbility  (bool) jeżeli false — nie dokleja linii “Zdolność”
 */
export default function PeelCard({
  title,
  subtitle,
  imageUrl,
  description,
  showAbility = true,
}) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => { setDragging(true); start.current = { x: e.clientX, y: e.clientY }; };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = Math.abs(e.clientX - start.current.x);
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx + dy > 12) setOpen(true);
  };
  const onPointerUp = () => setDragging(false);

  // Linijki w dolnej tabliczce: “Imię”, “Co robi”, “Zdolność (opcjonalnie)”
  const lines = [
    { label: "Imię", value: title || "" },
    { label: "Co robi", value: subtitle || "" },
  ];
  if (showAbility && description && description.trim()) {
    lines.push({ label: "Zdolność", value: description.trim() });
  }

  return (
    <div className="group relative">
      <div
        className="relative h-64 w-full [perspective:1200px] sm:h-72"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${open ? 0 : 180}deg)` }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden] witcher-card">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="witcher-portrait"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="witcher-plaque text-[12px] sm:text-[13px]">
              <div><span className="label">Imię: </span>{lines[0].value}</div>
              {lines[1]?.value && (
                <div className="mt-[2px]">
                  <span className="label">Co robi: </span>{lines[1].value}
                </div>
              )}
              {lines[2]?.value && (
                <div className="mt-[2px]">
                  <span className="label">Zdolność: </span>{lines[2].value}
                </div>
              )}
            </div>
          </div>

          {/* TYŁ */}
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.06),transparent),linear-gradient(to_bottom,#0b0b0b,#000)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="rear-cta">Odkryj kartę</div>
            </div>
            <button
              className="absolute bottom-2 right-2 h-10 w-10 rounded-lg border border-zinc-700/60 bg-zinc-900/70 text-zinc-200 shadow hover:bg-zinc-800 active:scale-95"
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

      {/* Przyciski pod kartą (np. “odłóż”) – zostawiamy minimalne */}
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
