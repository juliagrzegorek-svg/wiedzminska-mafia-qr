import React from "react";

// Używa obrazka: /public/assets/card-frame-gold.webp
// oraz obrazu bohatera (np. /public/assets/heroes/ciri.png)
export default function CardFront({
  title,
  role = "Bohater",
  imageUrl,
  plaqueTitle,         // np. "Imię: Ciri"
  plaqueWhat,          // np. "Co robi: Jasnowidzka"
  plaqueAbilityText,   // pełny opis zdolności (opcjonalnie)
}) {
  return (
    <div className="witcher-card">
      {/* obraz postaci */}
      <div className="art">
        {imageUrl && <img src={imageUrl} alt={title} />}
      </div>

      {/* nagłówek */}
      <div className="top">
        <div className="role">{role}</div>
        <div className="name">{title}</div>
      </div>

      {/* “tabliczka” na dole */}
      <div className="plaque">
        {plaqueTitle && <div className="line">{plaqueTitle}</div>}
        {plaqueWhat && <div className="line">{plaqueWhat}</div>}
        {plaqueAbilityText && (
          <div className="ability">{plaqueAbilityText}</div>
        )}
      </div>
    </div>
  );
}
