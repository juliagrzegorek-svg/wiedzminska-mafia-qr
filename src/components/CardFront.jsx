// src/components/CardFront.jsx
import React from "react";

/**
 * Wizual „przodu karty”:
 * - turkusowy ornamentowy back
 * - złota ramka (PNG/WebP z przezroczystym środkiem)
 * - portret postaci wewnątrz ramki
 * - plakietka na dole: Imię / Co robi / Zdolność (skrót)
 */
export default function CardFront({
  name,          // np. "Ciri"
  role,          // np. "Jasnowidzka" (albo "Bohater", "Potwór", itd.)
  abilityText,   // krótki opis/zasada do pokazania na plakietce
  imageUrl,      // ścieżka do portretu
}) {
  return (
    <div
      className="
        relative aspect-[2/3] w-full overflow-hidden rounded-2xl
        shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-1 ring-[#0c3a3a]/40
        bg-[radial-gradient(60%_40%_at_50%_20%,rgba(255,255,255,0.06)_0%,transparent_70%),linear-gradient(180deg,#0b3b3e_0%,#072527_100%)]
      "
    >
      {/* Portret – z marginesem, żeby nie „wchodził” pod ramę */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-contain p-6 pb-28"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      {/* Złota rama (przezroczysty środek) */}
      <img
        src="/assets/card-frame-gold.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />

      {/* Plakietka na dole karty */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]">
        <div className="mx-3 mb-3 rounded-xl border border-[#1a3f40]/50 bg-[#0b1313]/85 px-3 py-2 text-center">
          <div className="text-[12px] font-semibold tracking-wide text-[#e6c36a] drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
            <span className="opacity-90">Imię:</span> {name}
          </div>
          {role && (
            <div className="mt-0.5 text-[11px] font-medium text-[#d9b24d] opacity-95">
              <span className="opacity-90">Co robi:</span> {role}
            </div>
          )}
          {abilityText && (
            <div className="mt-1 text-[10px] leading-snug text-[#f1e4b0] opacity-95">
              <span className="opacity-90">Zdolność:</span> {abilityText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
