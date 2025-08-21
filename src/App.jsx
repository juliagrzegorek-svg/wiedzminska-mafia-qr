// === src/App.jsx ===
import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CHARACTERS } from './data/characters.js';
import { MONSTERS } from './data/monsters.js';
import { GOOD_ABILITIES, MONSTER_ABILITIES } from './data/abilities.js';
import { rtEnabled, upsertPlayer, subscribePlayers, getGameCode } from './realtime.js';
import './styles.css';

// ——— konfiguracja adresu dla QR ———
const PUBLIC_URL_KEY = 'game:public-url';
function getQrBase() {
  const saved = localStorage.getItem(PUBLIC_URL_KEY);
  return (saved || location.origin).replace(/\/+$/, '');
}
async function makeQR(url) {
  return await QRCode.toDataURL(url, {
    width: 220,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' },
  });
}

/* ---------- obrazki z fallbackami ---------- */
function ImgSeq({ candidates, alt, style }) {
  const [i, setI] = useState(0);
  const list = Array.from(new Set((candidates || []).filter(Boolean)));
  const src = list[i];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt || ''}
      onError={() => setI((v) => v + 1)}
      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', ...style }}
    />
  );
}
function imageCandidates(item) {
  if (!item) return [];
  const id = (item.id || '').toLowerCase();
  const hasExt = (p) => /\.(png|jpe?g|webp)$/i.test(p);
  const bases = [item.img, `/assets/${id}`, `/assets/heroes/${id}`, `/assets/monsters/${id}`, `/assets/characters/${id}`].filter(Boolean);
  const out = [];
  for (const b of bases) {
    if (hasExt(b)) out.push(b);
    else out.push(`${b}.png`, `${b}.jpg`, `${b}.webp`);
  }
  return out;
}

/* ---------- localStorage ---------- */
const LS = { name: 'player:name', gender: 'player:gender', hero: 'player:hero', monster: 'player:monster', ability: 'player:ability', step: 'player:step' };
const isHost = () => {
  const u = new URL(location.href);
  return u.searchParams.get('host') === '1' || u.hash.includes('host');
};
const params = new URLSearchParams(location.search);
const presetHeroId = params.get('pre') || null;
const monstersFlag = String(params.get('m') || params.get('monsters') || '').toLowerCase();
const withMonsters = ['1', 'true', 'yes', 'y', 'tak', 't'].includes(monstersFlag);

/* ---------- domyślna zdolność bohatera + potwora ---------- */
function getDefaultAbilityForHero(hero) {
  if (!hero) return null;
  let a = GOOD_ABILITIES.find((x) => Array.isArray(x.onlyFor) && x.onlyFor.includes(hero.id));
  if (a) return a;
  a = GOOD_ABILITIES.find((x) => (x.id || '').startsWith(hero.id + '-'));
  return a || null;
}
function getDefaultAbilityForMonster(monster) {
  if (!monster) return null;
  let a = MONSTER_ABILITIES.find((x) => Array.isArray(x.onlyFor) && x.onlyFor.includes(monster.id));
  if (a) return a;
  a = MONSTER_ABILITIES.find((x) => (x.id || '').startsWith(monster.id + '-'));
  return a || null;
}

/* ---------- właściciel (portret do karty zdolności) ---------- */
function resolveOwnerOfAbility(abilityId) {
  if (!abilityId) return null;
  const ownerHero = CHARACTERS.find((h) => getDefaultAbilityForHero(h)?.id === abilityId);
  if (ownerHero) return { type: 'hero', obj: ownerHero };
  const ownerMonster = MONSTERS.find((m) => getDefaultAbilityForMonster(m)?.id === abilityId);
  if (ownerMonster) return { type: 'monster', obj: ownerMonster };
  return null;
}

/* ---------- losowanie zdolności ---------- */
function pickAbility({ hero, monster }) {
  if (monster) {
    const base = getDefaultAbilityForMonster(monster);
    return base ? { ...base, ownerType: 'monster', ownerName: monster.name } : null;
  }
  if (hero) {
    // 1) pula zgodna z onlyFor/itp.
    const basePool = GOOD_ABILITIES.filter(
      (a) => !a.onlyFor || (Array.isArray(a.onlyFor) && a.onlyFor.includes(hero.id))
    );
    // 2) zdolności tej samej płci (jeśli właściciel zdolności to bohater/bohaterka)
    const sameGenderPool = basePool.filter((a) => {
      const owner = resolveOwnerOfAbility(a.id); // {obj:{gender:'f'|'m'}}
      const ownerGender = owner?.obj?.gender;
      return !ownerGender || ownerGender === hero.gender;
    });
    const list = sameGenderPool.length ? sameGenderPool : basePool;
    const ability = list[Math.floor(Math.random() * list.length)];
    const owner = resolveOwnerOfAbility(ability.id);
    const ownerName = owner?.obj?.name || hero.name;
    return { ...ability, ownerType: 'good', ownerName };
  }
  return null;
}

export default function App() {
  const [hostMode, setHostMode] = useState(isHost());
  useEffect(() => {
    const h = () => setHostMode(isHost());
    addEventListener('hashchange', h);
    return () => removeEventListener('hashchange', h);
  }, []);

  const [name, setName] = useState(localStorage.getItem(LS.name) || '');
  const [gender, setGender] = useState(localStorage.getItem(LS.gender) || 'K');

  const [hero, setHero] = useState(() => JSON.parse(localStorage.getItem(LS.hero) || 'null'));
  const [monster, setMonster] = useState(() => JSON.parse(localStorage.getItem(LS.monster) || 'null'));
  const [ability, setAbility] = useState(() => JSON.parse(localStorage.getItem(LS.ability) || 'null'));
  const [step, setStep] = useState(localStorage.getItem(LS.step) || 'start');

  const [abilityOpen, setAbilityOpen] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [focus, setFocus] = useState(null);

  // MENU
  const [menuOpen, setMenuOpen] = useState(false);

  // host
  const [players, setPlayers] = useState([]);
  const [qrMap, setQrMap] = useState({});
  const [qrBig, setQrBig] = useState(null);
  const [qrStart, setQrStart] = useState(null);
  const [qrBaseUrl, setQrBaseUrl] = useState(getQrBase());
  function setPublicQrUrl() {
    const next = prompt('Publiczny URL dla QR (np. http://192.168.0.12:5173 albo https://twojadomena):', qrBaseUrl);
    if (!next) return;
    const cleaned = next.trim().replace(/\/+$/, '');
    localStorage.setItem(PUBLIC_URL_KEY, cleaned);
    setQrBaseUrl(cleaned);
  }

  // narracja
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [typing, setTyping] = useState('');
  const typingTimer = useRef(null);

  const fullText =
    'Mroczny Krąg od jakiegoś czasu sabotuje naszym życiem. Zażyliście ich eliksirów, przez co zdolności Waszych postaci wymieszały się. ' +
    'Czy Yen jest dalej lekarką a Emhyr jako sędzia nadal uniewinni przed śmiercią? ' +
    'Strzeżcie się Mrocznego Kręgu — szepczą i tną nici zaufania. ' +
    'Nie wierzcie nikomu. Nawet sobie.';

  const presetHero = useMemo(() => CHARACTERS.find((c) => c.id === presetHeroId) || null, []);

  // „samoleczenie” stanu po wejściu na czarnej stronie
  useEffect(() => {
    if (step !== 'start' && (!hero || !name.trim())) {
      setStep('start'); setFocus(null); setZoom(null);
    }
    if (step === 'monster' && !monster) setStep('hero-placed');
    if (step === 'ability' && !ability) setStep('hero-placed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => { localStorage.setItem(LS.name, name); }, [name]);
  useEffect(() => { localStorage.setItem(LS.gender, gender); }, [gender]);
  useEffect(() => { localStorage.setItem(LS.step, step); }, [step]);
  useEffect(() => { hero ? localStorage.setItem(LS.hero, JSON.stringify(hero)) : localStorage.removeItem(LS.hero); }, [hero]);
  useEffect(() => { monster ? localStorage.setItem(LS.monster, JSON.stringify(monster)) : localStorage.removeItem(LS.monster); }, [monster]);
  useEffect(() => { ability ? localStorage.setItem(LS.ability, JSON.stringify(ability)) : localStorage.removeItem(LS.ability); }, [ability]);
  useEffect(() => { setZoom(null); }, [step]);

  // host realtime
useEffect(() => {
  if (!hostMode) return;
  const un = subscribePlayers(setPlayers); // w trybie bez RT zwróci pustą listę i no-opa
  return () => un && un();
}, [hostMode]);



  // QR start
 useEffect(() => {
  (async () => {
    const link = `${qrBaseUrl}${location.pathname}?g=${getGameCode()}`;
    try {
      setQrStart(await makeQR(link));
    } catch (e) {
      setQrStart(null);
    }
  })();
}, [qrBaseUrl]);
  function buildLinkFor(c) {
    return `${qrBaseUrl}${location.pathname}?g=${getGameCode()}&pre=${c.id}`;
  }
  useEffect(() => {
    if (!hostMode) return;
    (async () => {
      const entries = await Promise.all(CHARACTERS.map(async (c) => [c.id, await makeQR(buildLinkFor(c))]));
      setQrMap(Object.fromEntries(entries));
    })().catch(() => {});
  }, [hostMode, qrBaseUrl]);

  async function publish() {
    await upsertPlayer({
      name,
      gender,
      hero_id: hero?.id || null,
      hero_name: hero?.name || null,
      monster_id: monster?.id || null,
      monster_name: monster?.name || null,
      ability_id: ability?.id || null,
      ability_title: ability ? `${ability.ownerName} — ${ability.title?.split('—')?.[1]?.trim() || ability.title}` : null,
      ability_side: ability?.ownerType || null,
      updated_at: new Date().toISOString(),
    });
  }

  /* ---------- START GAME ---------- */
  function startGame(e) {
    e.preventDefault();
    if (!name.trim()) return;

    // mapowanie płci z formularza (K/M) -> 'f'/'m'
    const g = (gender === 'K') ? 'f' : 'm';

    // preset z QR tylko jeśli pasuje płcią
    let pickedHero = (presetHero && presetHero.gender === g) ? presetHero : null;

    // albo los z puli tej samej płci
    if (!pickedHero) {
      const pool = CHARACTERS.filter(c => c.gender === g);
      pickedHero = pool[Math.floor(Math.random() * pool.length)];
    }

    // opcjonalny potwór (?m=1)
    let pickedMonster = null;
    if (withMonsters) {
      pickedMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    }

    setAbility(null);
    setHero(pickedHero);
    setMonster(pickedMonster);
    setStep('hero');
    setFocus('left');
    setAbilityOpen(false);

    setTimeout(publish, 0);
  }

  function onHeroClick() {
    if (step === 'hero') {
      setStep('hero-placed');
      setFocus('left');
      if (monster) setTimeout(() => { setStep('monster'); setFocus('center'); }, 420);
      else setTimeout(() => triggerAlert(), 380);
      setTimeout(publish, 0);
    } else {
      setZoom((z) => (z === 'left' ? null : 'left'));
    }
  }

  function onMonsterClick() {
    if (step === 'monster') {
      setStep('monster-placed');
      setFocus('center');
      setTimeout(() => triggerAlert(), 380);
      setTimeout(publish, 0);
    } else {
      setZoom((z) => (z === 'center' ? null : 'center'));
    }
  }

  function triggerAlert() {
    setShowOverlay(true);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setTyping('');
      let i = 0;
      clearInterval(typingTimer.current);
      typingTimer.current = setInterval(() => {
        i++; setTyping(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(typingTimer.current);
      }, 55);
    }, 3000);
  }

  function onOverlayClick() {
    if (typing.length < fullText.length) return;
    if (!ability) {
      const picked = pickAbility({ hero, monster });
      if (picked) setAbility(picked);
    }
    setShowOverlay(false);
    setStep('ability');
    setAbilityOpen(true);
    setFocus('right');
    setTimeout(publish, 0);
  }

  function onAbilityClick() {
    if (step === 'ability') {
      setStep('done'); setAbilityOpen(false); setFocus(null);
      setTimeout(publish, 0);
    } else {
      setAbilityOpen((v) => !v);
      setFocus((f) => (f === 'right' ? null : 'right'));
    }
  }

  function resetAll() {
    for (const k of Object.values(LS)) localStorage.removeItem(k);
    setHero(null); setMonster(null); setAbility(null);
    setStep('start'); setAbilityOpen(false); setFocus(null); setZoom(null);
    setTimeout(publish, 0);
  }

  // wyliczenia do widoku
  const abilityOwnerForPortrait = useMemo(() => {
    if (!ability) return null;
    const owner = resolveOwnerOfAbility(ability.id);
    if (owner?.obj) return owner.obj;
    return ability.ownerType === 'monster' ? monster : hero;
  }, [ability, hero, monster]);

  const abilityPortraitCandidates = useMemo(() => imageCandidates(abilityOwnerForPortrait), [abilityOwnerForPortrait]);
  const abilityClass = ability?.ownerType === 'monster' ? 'monster' : 'good';

  const abilityNameOnly = (() => {
    if (!ability?.title) return '';
    const parts = ability.title.split('—');
    return (parts[1] || parts[0] || '').trim();
  })();

  const heroDefaultAbility = getDefaultAbilityForHero(hero);
  const heroDefaultNameOnly = (() => {
    if (!heroDefaultAbility?.title) return '';
    const parts = heroDefaultAbility.title.split('—');
    return (parts[1] || parts[0] || '').trim();
  })();

  const monsterDefaultAbility = getDefaultAbilityForMonster(monster);
  const monsterDefaultNameOnly = (() => {
    if (!monsterDefaultAbility?.title) return '';
    const parts = monsterDefaultAbility.title.split('—');
    return (parts[1] || parts[0] || '').trim();
  })();

  // ——— Bezpieczne tytuł/opis dla karty zdolności ———
  const abilityTitleSafe = useMemo(() => {
    if (!ability) return '';
    if (ability.title && ability.title.trim()) return ability.title;
    const namePart = abilityNameOnly || '';
    const ownerPart = ability.ownerName || '';
    return `Zdolność: ${ownerPart}${namePart ? ` — ${namePart}` : ''}`;
  }, [ability, abilityNameOnly]);

  const abilityDescSafe = ability?.description || '';

  function newCode() { localStorage.removeItem('game:code'); location.reload(); }
  async function copy(t) { try { await navigator.clipboard.writeText(t); } catch {} }
  function openQR(c) { setQrBig({ name: c.name, data: qrMap[c.id], link: buildLinkFor(c) }); }

  const heroPosClass =
    (step === 'hero' || zoom === 'left') ? 'centered zoom'
      : (['hero-placed', 'monster', 'monster-placed', 'ability', 'done'].includes(step) ? 'laid-left' : 'at-left');

  const monsterPosClass =
    !monster ? '' :
      (step === 'monster' || zoom === 'center') ? 'centered zoom'
        : (['monster-placed', 'ability', 'done'].includes(step) ? 'laid-center' : 'at-center');

  const abilityPosClass =
    !ability ? '' :
      ((step === 'ability' || abilityOpen) ? 'centered zoom'
        : (step === 'done' ? 'laid-right' : 'at-right'));

  return (
    <div className={`app ${hostMode ? 'is-host' : ''}`}>
{hostMode && (
  <div style={{
    position:'fixed', top:8, left:8, zIndex: 999999,
    color:'#fff', fontWeight:700, pointerEvents:'none'
  }}>
    HOST: {getGameCode()} {rtEnabled ? '' : '(RT off)'}
  </div>
)}

      {/* HOST */}
      {hostMode && (
        <div className="host">
          <div className="host-header">
            Panel Mistrza Gry — kod gry: {getGameCode()} {rtEnabled ? '' : '(realtime wyłączony)'}
          </div>

          <div className="host-actions">
            <button className="btn" onClick={() => copy(`${qrBaseUrl}${location.pathname}?g=${getGameCode()}`)}>Kopiuj link do gry</button>
            <button className="btn" onClick={newCode}>Nowy kod gry</button>
            <button className="btn" onClick={setPublicQrUrl}>Ustaw URL do QR</button>
          </div>

          {(location.hostname === 'localhost' || location.hostname === '127.0.0.1') && (
            <div className="small" style={{ marginTop: 6, opacity: .85 }}>
              QR z <b>localhost</b> nie działa na telefonie. Ustaw adres LAN (np. <i>http://192.168.x.x:5173</i>) albo domenę produkcyjną.
            </div>
          )}

          <div className="host-list">
            <div className="row head">
              <div>Gracz</div><div>Bohater</div><div>Potwór</div><div>Zdolność</div><div>czas</div>
            </div>
            {players.map(p => (
              <div className="row" key={p.player_id || (p.name + p.updated_at)}>
                <div>{p.name} <span className="muted">({p.gender})</span></div>
                <div>{p.hero_name || <span className="muted">—</span>}</div>
                <div>{p.monster_name || <span className="muted">—</span>}</div>
                <div>{p.ability_title ? (<><span className={p.ability_side === 'monster' ? 'tag monster' : 'tag good'}></span>{p.ability_title}</>) : <span className="muted">—</span>}</div>
                <div className="muted">{new Date(p.updated_at).toLocaleTimeString?.() || ''}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8, fontWeight: 700 }}>QR bohaterów (kliknij aby powiększyć):</div>
          <div className="host-qr">
            {CHARACTERS.map(c => (
              <div className="qr-card" key={c.id} onClick={() => openQR(c)} title={c.name}>
                {qrMap[c.id] ? <img src={qrMap[c.id]} alt={`QR ${c.name}`} /> : <span className="small">generuję…</span>}
                <span className="small">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {qrBig && (
        <div className="qr-modal" onClick={() => setQrBig(null)}>
          <div className="qr-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{qrBig.name}</div>
            <img src={qrBig.data} alt={`QR ${qrBig.name}`} />
            <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="btn" onClick={() => copy(qrBig.link)}>Kopiuj link</button>
              <button className="btn" onClick={() => setQrBig(null)}>Zamknij</button>
            </div>
          </div>
        </div>
      )}

 {step === 'start' && (
  <div className={`start ${hostMode ? 'no-bg' : ''}`}>
    <form className="form" onSubmit={startGame}>
      <div style={{ fontWeight: 700, marginRight: 8 }}>
        Wpisz imię i nazwisko gracza oraz płeć:
      </div>
      <input
        type="text"
        placeholder="Imię i nazwisko"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="gender">
        <label>
          <input
            type="radio"
            name="gender"
            value="K"
            checked={gender === 'K'}
            onChange={(e) => setGender(e.target.value)}
          />
          Kobieta
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="gender"
            value="M"
            checked={gender === 'M'}
            onChange={(e) => setGender(e.target.value)}
          />
          Mężczyzna
        </label>
      </div>
      <button className="btn" disabled={!name.trim()} type="submit">
        Losuj kartę
      </button>
    </form>

    {/* QR tylko dla gracza, nie dla hosta */}
{qrStart && (
  <div className="start-qr">
    <img src={qrStart} alt="QR do uruchomienia na telefonie" />
    <span className="small">Zeskanuj, aby otworzyć na telefonie</span>
  </div>
)}


  </div>
)}
{/* STÓŁ */}
{step !== 'start' && (
  <div className="table">
    {!hostMode && <div className="table-surface" />}
{!hostMode && (step === 'ability' || step === 'done') && (
  <button
    className="hamburger"
    aria-label="Menu"
    onClick={() => setMenuOpen(true)}
  >
    <span></span><span></span><span></span>
  </button>
)}

          {/* BOHATER */}
          {hero && (
            <div
              className={[
                'card',
                focus === 'left' ? 'focus' : '',
                (step === 'hero' || zoom === 'left') ? 'centered zoom'
                  : (['hero-placed', 'monster', 'monster-placed', 'ability', 'done'].includes(step) ? 'laid-left' : 'at-left'),
              ].join(' ')}
              onClick={onHeroClick}
              style={{ zIndex: (step === 'hero' || zoom === 'left') ? 9800 : (focus === 'left' ? 1100 : 800) }}
            >
              <div className="media">
                <ImgSeq candidates={imageCandidates(hero)} alt={hero?.name} />
              </div>

              <div className="body ornament">
                <div className="pretitle">Twoja postać to:</div>
                <h3>{hero.name}</h3>
                <div className="role">{hero.gender === 'f' ? 'Bohaterka' : 'Bohater'}</div>
                <div className="meta">
                  <div><b>Co robi?</b> {hero.what}</div>
                  <div><b>Zdolność:</b> {heroDefaultNameOnly || '—'}</div>
                </div>
                <div className="action">
                  <button type="button">
                    {step === 'hero' ? 'Odłóż kartę na stół' : ((step === 'hero' || zoom === 'left') ? 'Schowaj' : 'Powiększ')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POTWÓR */}
          {monster && (
            <div
              className={[
                'card',
                focus === 'center' ? 'focus' : '',
                monsterPosClass,
              ].join(' ')}
              onClick={onMonsterClick}
              style={{ zIndex: (step === 'monster' || zoom === 'center') ? 9800 : (focus === 'center' ? 1200 : 900) }}
            >
              <div className="media">
                <ImgSeq candidates={imageCandidates(monster)} alt={monster.name} />
              </div>
              <div className="body ornament">
                <h3>{monster.name}</h3>
                <div className="role">Potwór</div>
                <div className="meta">
                  <div><b>Co robi?</b> {monster.what}</div>
                  <div><b>Zdolność:</b> {monsterDefaultNameOnly || '—'}</div>
                </div>
                <div className="action">
                  <button type="button">
                    {step === 'monster' ? 'Odłóż kartę' : (monsterPosClass.includes('centered') ? 'Schowaj' : 'Powiększ')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ZDOLNOŚĆ */}
          {ability && (
            <div
              className={[
                'card', 'ability', abilityClass,
                abilityPosClass,
                (focus === 'right' ? 'focus' : ''),
              ].join(' ')}
              onClick={onAbilityClick}
              style={{ zIndex: (step === 'ability' || abilityOpen) ? 9800 : 1300 }}
            >
              <div className="media">
                <ImgSeq
                  candidates={abilityPortraitCandidates}
                  alt={abilityOwnerForPortrait?.name || ability?.ownerName}
                />
              </div>

              <div className="body ornament">
                <h3>{abilityTitleSafe}</h3>
                <div className="role">Karta zdolności</div>
                <div className="meta">
                  <p><b>Twoja aktualna zdolność:</b> {abilityTitleSafe}</p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{abilityDescSafe}</p>
                </div>
                <div className="action">
                  <button type="button">
                    {step === 'ability' ? 'Odłóż kartę na stół' : (abilityOpen ? 'Schowaj' : 'Pokaż')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OVERLAY */}
          {showOverlay && (
            <div className="overlay" onClick={onOverlayClick}>
              <div className="smoke"></div>
              {showAlert
                ? <div className="alert">Ludzie uważajcie!</div>
                : <div className="typewriter">{typing}<span className="cursor"></span></div>}
            </div>
          )}

          {/* RESET */}
          <div style={{ position: 'absolute', top: 12, right: 12, opacity: .7, fontSize: 12 }}>
            <button onClick={resetAll} className="btn" style={{ padding: '6px 10px' }}>RESET</button>
          </div>
        </div>
      )}

      {/* MENU */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-box" onClick={e => e.stopPropagation()}>
            <div className="menu-title">Karty bohaterów — pierwotne opisy</div>

            <div className="menu-grid">
              {CHARACTERS.map(h => {
                const a = getDefaultAbilityForHero(h);
                const nameOnly = a?.title ? (a.title.split('—')[1] || a.title).trim() : '';
                return (
                  <div className="mini-card" key={h.id}>
                    <div className="mini-media">
                      <ImgSeq candidates={imageCandidates(h)} alt={h.name} />
                    </div>
                    <div className="mini-body">
                      <div className="mini-name">{h.name}</div>
                      <div className="mini-line"><b>Co robi?</b> {h.what || '—'}</div>
                      <div className="mini-line"><b>Zdolność:</b> {nameOnly || '—'}</div>
                      <div className="mini-desc" style={{ whiteSpace: 'pre-wrap' }}>{a?.description || '—'}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button className="btn" onClick={() => setMenuOpen(false)}>Zamknij</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
