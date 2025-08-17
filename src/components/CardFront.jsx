import React from "react";

/**
 * Karta w stylu: turkusowe tło + złoty ornament.
 * Wewnątrz obraz postaci/potwora, podpis (imię + rola),
 * a pod kartą sekcja z "Co robi?" i (opcjonalnie) "Zdolność".
 */
export default function CardFront({ imageUrl, name, role, abilityTitle }) {
  return (
    <div className="witcher-card">
      <div className="card-canvas">
        <div className="card-bg" />
        {imageUrl && <img src={imageUrl} alt={name} className="card-image" />}
        {/* złota rama – przezroczyste tło, nakładka na całą kartę */}
        <img
          className="card-frame"
          src="/assets/card-frame-gold.webp"
          alt=""
          aria-hidden="true"
        />

        <div className="card-caption">
          <div className="card-name">{name}</div>
          <div className="card-role">{role}</div>
        </div>
      </div>

      <div className="card-info">
        <div className="info-row">
          <span className="label">Co robi?</span>
          <span className="value">{role}</span>
        </div>

        {abilityTitle &&
          abilityTitle.trim() !== "" &&
          abilityTitle.toLowerCase() !== "obywatel" && (
            <div className="info-row">
              <span className="label">Zdolność</span>
              <span className="value">{abilityTitle}</span>
            </div>
          )}
      </div>
    </div>
  );
}
