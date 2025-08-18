// === POCZĄTEK pliku src/App.jsx ===
import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CHARACTERS } from './data/characters.js';
import { MONSTERS } from './data/monsters.js';
import { GOOD_ABILITIES, MONSTER_ABILITIES } from './data/abilities.js';
import { rtEnabled, upsertPlayer, subscribePlayers, getGameCode } from './realtime.js';
import './styles.css';

/* SmartImg — JEDYNA definicja */
function SmartImg({ src, kind, id, name }) {
  const [i, setI] = useState(0);
export default function App() {
  // ...
}

  const strip = (s) => (s || '').trim().replace(/\s+/g, ' ');
  const deacc = (s) => strip(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const slug  = (s) => deacc(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const rawName   = strip(name);
  const nameNoAcc = deacc(name);
  const slugName  = slug(name);
  const first     = slugName.split('-')[0] || '';

  const bases = useMemo(() => {
    const b = new Set();
    if (src) b.add(src); // najwyższy priorytet
    const keys = Array.from(new Set([id, slugName, first, rawName, nameNoAcc].filter(Boolean)));
    const dirs = ['/assets/characters', '/assets', '/characters'];
    dirs.forEach(d => keys.forEach(k => b.add(`${d}/${k}`)));
    return Array.from(b);
  }, [src, id, name]);

  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP'];

  const candidates = useMemo(() => {
    const out = [];
    for (const base of bases) {
      if (/\.(png|jpe?g|webp)$/i.test(base)) out.push(base);
      else exts.forEach(e => out.push(base + e));
    }
    return out;
  }, [bases]);

  const url = candidates[i];

  return url
    ? <img src={url} alt={name} onError={() => setI(v => v + 1)}
           style={{ width:'100%', height:'100%', objectFit:'contain', objectPosition:'center' }} />
    : <div style={{ width:'100%', height:'100%' }} />;
}
// === KONIEC nagłówka; poniżej zostaje Twój komponent App ===


