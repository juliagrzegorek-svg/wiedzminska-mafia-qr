import React from "react";

export default function AbilityCard({ title, description }) {
  return (
    <div className="card-turquoise">
      <div className="text-sm font-semibold">{title}</div>
      {description && <div className="mt-1 text-[13px] leading-relaxed opacity-95">{description}</div>}
    </div>
  );
}
