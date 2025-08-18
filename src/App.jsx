/* MEGA-FALLBACK do public/assets (obsługuje spacje, PL znaki, wielkie litery i różne rozszerzenia) */
function SmartImg({ src, kind, id, name }) {
  const [i, setI] = React.useState(0);
import React, { useEffect, useMemo, useRef, useState } from 'react';

  const strip = (s) =>
    (s || "").trim().replace(/\s+/g, " ");
  const deacc = (s) =>
    strip(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const slug = (s) =>
    deacc(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const rawName = strip(name);
  const nameNoAcc = deacc(name);
  const slugName = slug(name);
  const first = slugName.split("-")[0] || "";

  const bases = React.useMemo(() => {
    const b = new Set();

    // 0) jeśli w danych podasz exact path → to najpierw
    if (src) b.add(src);

    // 1) warianty klucza (id, slug, pierwsze słowo, oryginalna nazwa, nazwa bez ogonków)
    const keys = Array.from(
      new Set([id, slugName, first, rawName, nameNoAcc].filter(Boolean))
    );

    // 2) katalogi do sprawdzenia
    const dirs = [
      `/assets/characters`,
      `/assets`,
      `/characters`,
    ];

    // 3) zbuduj bazy
    for (const d of dirs) {
      for (const k of keys) {
        // jeżeli k wygląda na „już z rozszerzeniem” — dodaj bez zmian
        if (/\.(png|jpe?g|webp)$/i.test(k)) b.add(`${d}/${k}`);
        else {
          b.add(`${d}/${k}`); // później dołożymy rozszerzenia
        }
      }
    }

    return Array.from(b);
  }, [src, id, name]);

  const exts = [".png", ".jpg", ".jpeg", ".webp", ".PNG", ".JPG", ".JPEG", ".WEBP"];

  const candidates = React.useMemo(() => {
    const out = [];
    for (const base of bases) {
      if (/\.(png|jpe?g|webp)$/i.test(base)) out.push(base);
      else exts.forEach((e) => out.push(base + e));
    }
    // włącz logi: ?debug=img
    if (new URLSearchParams(location.search).get("debug") === "img") {
      console.debug("[SmartImg] próby:", out);
    }
    return out;
  }, [bases]);

  const url = candidates[i];

  if (!url) {
    return (
      <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,opacity:.7}}>
        (brak obrazu)
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      onError={() => setI((v) => v + 1)}
      style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
    />
  );
}
export default function App() {
  // ...
}
