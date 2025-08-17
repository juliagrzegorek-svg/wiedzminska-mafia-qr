import React from "react";

export default function AbilityCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-teal-400/60 bg-teal-900/40 p-4 text-teal-100 shadow-[0_0_30px_rgba(20,184,166,0.25)]">
      <div className="text-sm uppercase tracking-widest opacity-80">Zdolność</div>
      <div className="mt-1 text-lg font-semibold">{title}</div>
      {description && <p className="mt-2 text-sm">{description}</p>}
    </div>
  );
}
