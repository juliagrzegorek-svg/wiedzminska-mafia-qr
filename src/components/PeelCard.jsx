import React, { useRef, useState } from "react";

/**
 * PeelCard — karta z animacją „pociągnięcia rogu”.
 * Klik dolnego prawego rogu (lub krótkie przeciągnięcie) „odkrywa” kartę.
 */
export default function PeelCard({ title, subtitle, imageUrl, description }) {
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
        className="relative h-56 w-full [perspective:1200px]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-sm transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${open ? 0 : 180}deg)` }}
        >
          {/* FRONT — odkryta karta */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-zinc-400/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-sm font-semibold text-white">{title}</div>
              {subtitle && <div className="text-xs text-zinc-300">{subtitle}</div>}
            </div>
          </div>

          {/* BACK — rewers (przed odkryciem) */}
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.06),transparent),linear-gradient(to_bottom,#0b0b0b,#000)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-xl border border-zinc-700/60 px-3 py-1 text-xs tracking-wider text-zinc-300">
                Odkryj kartę
              </div>
            </div>
            <button
              className="absolute bottom-2 right-2 h-10 w-10 rounded-lg border border-zinc-700/60 bg-zinc-900/70 text-zinc-200 shadow hover:bg-zinc-800 active:scale-95"
              onPointerDown={onPointerDown}
              onClick={() => setOpen(true)}
              title="Pociągnij/kliknij, by odkryć"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="mx-auto opacity-80">
                <path d="M6 18c6 0 12-6 12-12v12H6z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {description && <div className="mt-2 text-xs text-zinc-400">{description}</div>}

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
