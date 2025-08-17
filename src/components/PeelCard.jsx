import React, { useRef, useState } from "react";

export default function PeelCard({ title, subtitle, imageUrl, description, onOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => { setDragging(true); start.current = { x: e.clientX, y: e.clientY }; };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = Math.abs(e.clientX - start.current.x);
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx + dy > 10) { setOpen(true); onOpen?.(); }
  };
  const onPointerUp = () => setDragging(false);

  return (
    <div className="group relative">
      <div
        className="relative h-[360px] w-full max-w-[420px] mx-auto [perspective:1200px]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Front/back flip */}
        <div
          className="absolute inset-0 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${open ? 0 : 180}deg)` }}
        >
          {/* FRONT (widoczny po odkryciu) */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]">
            {/* Turkusowy ornamentowy tył + portret */}
            <div className="absolute inset-0 bg-[#0f3f47]">
              <div className="absolute inset-0 opacity-90"
                   style={{ background:
                     "radial-gradient(80% 60% at 50% 10%, rgba(255,255,255,.08), transparent 60%), radial-gradient(60% 40% at 50% 100%, rgba(0,0,0,.35), transparent 60%)" }} />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-contain p-8"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              {/* Złota ramka jako nakładka png/webp z przezroczystością */}
              <img
                src="/assets/card-frame-gold.webp"
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
              />
            </div>

            {/* Tabliczka z napisem u dołu */}
            <div className="absolute inset-x-6 bottom-5 rounded-md bg-black/55 px-4 py-2 ring-1 ring-yellow-700/40">
              <div className="text-[15px] font-semibold text-[#f8e6a8] drop-shadow">
                {title}
              </div>
              {subtitle && (
                <div className="text-[12px] text-[#d7c38f] -mt-0.5">{subtitle}</div>
              )}
            </div>

            {/* Opcjonalny opis pod kartą (poza frontem) */}
          </div>

          {/* BACK (widoczny przed odkryciem) */}
          <div className="absolute inset-0 rounded-2xl bg-[#0a1a1c] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-xl border border-zinc-700/60 px-3 py-1 text-xs tracking-wider text-zinc-300">
                Odkryj kartę
              </div>
            </div>
            <button
              className="absolute bottom-2 right-2 h-10 w-10 rounded-lg border border-zinc-700/60 bg-zinc-900/70 text-zinc-200 shadow hover:bg-zinc-800 active:scale-95"
              onPointerDown={onPointerDown}
              onClick={() => { setOpen(true); onOpen?.(); }}
              title="Pociągnij/kliknij, by odkryć"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="mx-auto opacity-80">
                <path d="M6 18c6 0 12-6 12-12v12H6z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Opis (np. zdolność potwora) pod kartą */}
      {description && (
        <div className="mx-auto mt-3 max-w-[420px] text-center text-sm text-zinc-300">
          {description}
        </div>
      )}

      {open && (
        <div className="mt-2 text-center">
          <button
            className="rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
            onClick={() => { setOpen(false); onClose?.(); }}
          >
            Odłóż kartę na stół
          </button>
        </div>
      )}
    </div>
  );
}
