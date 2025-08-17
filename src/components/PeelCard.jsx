import React, { useRef, useState } from "react";

export default function PeelCard({ title, subtitle, imageUrl, description }) {
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

  return (
    <div className="group relative">
      <div
        className="relative h-56 w-full [perspective:1200px]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${open ? 0 : 180}deg)` }}
        >
          {/* przód */}
          <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden]">
            <div className="gwent-card">
              <div className="portrait">
                {imageUrl && <img src={imageUrl} alt={title} onError={(e)=>e.currentTarget.style.display='none'} />}
              </div>
              <div className="plaque">
                <div>Imię: <strong>{title}</strong></div>
                <div>{subtitle ? `Co robi: ${subtitle}` : ""}</div>
                {description && <div className="mt-1">Zdolność: {description}</div>}
              </div>
              <div className="gold-frame" />
            </div>
          </div>

          {/* tył */}
          <div className="card-back absolute inset-0 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="rounded-xl border border-zinc-700/60 px-3 py-1 text-xs tracking-wider">
              Odkryj kartę
            </div>
            <button
              className="absolute bottom-2 right-2 h-10 w-10 rounded-lg border border-zinc-700/60 bg-zinc-900/70 text-zinc-200 shadow hover:bg-zinc-800 active:scale-95"
              onPointerDown={onPointerDown}
              onClick={() => setOpen(true)}
              title="Pociągnij/kliknij, by odkryć"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="mx-auto opacity-80"><path d="M6 18c6 0 12-6 12-12v12H6z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      </div>

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
