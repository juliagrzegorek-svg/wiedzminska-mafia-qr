import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CHARACTERS } from './data/characters.js';
import { MONSTERS } from './data/monsters.js';
import { GOOD_ABILITIES, MONSTER_ABILITIES } from './data/abilities.js';
import { rtEnabled, upsertPlayer, subscribePlayers, getGameCode } from './realtime.js';
import './styles.css';

/* SmartImg — jeden, pewny loader z fallbackami (w tym .png.png) */
function SmartImg({ src, id, name }) {
  const [i, setI] = useState(0);
  const strip = (s) => (s || '').trim().replace(/\s+/g, ' ');
  const deacc = (s) => strip(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const slug  = (s) => deacc(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const rawName   = strip(name);
  const nameNoAcc = deacc(name);
  const slugName  = slug(name);
  const first     = slugName.split('-')[0] || '';

  const bases = useMemo(() => {
    const b = new Set();
    if (src) b.add(src); // najpierw to, co podane w danych
    const keys = Array.from(new Set([id, slugName, first, rawName, nameNoAcc].filter(Boolean)));
    const dirs = ['/assets', '/assets/characters', '/characters', '/assets/monsters', '/monsters'];
    dirs.forEach(d => keys.forEach(k => b.add(`${d}/${k}`)));
    return Array.from(b);
  }, [src, id, name]);

  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP', '.png.png'];

  const candidates = useMemo(() => {
    const out = [];
    for (const base of bases) {
      if (/\.(png|jpe?g|webp)(\.png)?$/i.test(base)) out.push(base);
      else exts.forEach(e => out.push(base + e));
    }
    if (new URLSearchParams(location.search).get('debug') === 'img') {
      console.debug('[SmartImg log]', out);
    }
    return out;
  }, [bases]);

  const url = candidates[i];
  return url
    ? <img src={url} alt={name} onError={() => setI(v => v + 1)}
           style={{ width:'100%', height:'100%', objectFit:'contain', objectPosition:'center' }} />
    : <div style={{ width:'100%', height:'100%' }} />;
}

/* ==== A P P ==== */
const LS = {
  name: 'player:name', gender: 'player:gender',
  hero: 'player:hero', monster: 'player:monster', ability: 'player:ability',
  step: 'player:step'
};

const detectHost = () => {
  const u = new URL(window.location.href);
  return u.searchParams.get('host') === '1' || u.hash.replace('#','').includes('host');
};
const params = new URLSearchParams(location.search);
const presetHeroId = params.get('pre') || null;

export default function App(){
  const [hostMode,setHostMode] = useState(detectHost());
  useEffect(()=>{ const onHash=()=>setHostMode(detectHost()); window.addEventListener('hashchange',onHash); return ()=>window.removeEventListener('hashchange',onHash) },[]);

  const [name,setName] = useState(localStorage.getItem(LS.name) || '');
  const [gender,setGender] = useState(localStorage.getItem(LS.gender) || 'K');

  const [hero,setHero] = useState(()=> JSON.parse(localStorage.getItem(LS.hero) || 'null'));
  const [monster,setMonster] = useState(()=> JSON.parse(localStorage.getItem(LS.monster) || 'null'));
  const [ability,setAbility] = useState(()=> JSON.parse(localStorage.getItem(LS.ability) || 'null'));
  const [step,setStep] = useState(localStorage.getItem(LS.step) || 'start');
  const [abilityOpen,setAbilityOpen] = useState(false);

  const [focus,setFocus] = useState('center');
  const [zoom,setZoom]   = useState(null); // 'left' | 'center' | 'right' | null

  const [showOverlay,setShowOverlay] = useState(false);
  const [showAlert,setShowAlert] = useState(false);
  const [typing,setTyping] = useState('');

  const [players,setPlayers] = useState([]);
  const [qrMap,setQrMap] = useState({});
  const [qrBig,setQrBig] = useState(null);
  const [qrStart,setQrStart] = useState(null);

  const fullText = 'W dzisiejszym jedzeniu został wykryty eliksir, który sprawił, że zdolności bohaterów pomieszały się. Czy Yen to Yen? Czy Emhyr wciąż może okazać łaskę?';
  const typingTimer = useRef(null);

  const presetHero = useMemo(()=> CHARACTERS.find(c=>c.id===presetHeroId) || null, []);
  useEffect(()=>{ if(presetHero) setGender(presetHero.sex) },[presetHero]);

  useEffect(()=>{ localStorage.setItem(LS.name, name) },[name]);
  useEffect(()=>{ localStorage.setItem(LS.gender, gender) },[gender]);
  useEffect(()=>{ localStorage.setItem(LS.step, step) },[step]);
  useEffect(()=>{ hero && localStorage.setItem(LS.hero, JSON.stringify(hero)) },[hero]);
  useEffect(()=>{ monster && localStorage.setItem(LS.monster, JSON.stringify(monster)) },[monster]);
  useEffect(()=>{ ability && localStorage.setItem(LS.ability, JSON.stringify(ability)) },[ability]);

  useEffect(()=>{ if(!hostMode || !rtEnabled) return; const un = subscribePlayers(setPlayers); return ()=>un&&un() },[hostMode]);

  // każda zmiana kroku — zamykamy powiększenia
  useEffect(()=>{ setZoom(null); }, [step]);

  // QR na stronie startowej
  useEffect(() => {
    (async () => {
      try {
        const link = `${location.origin}${location.pathname}?g=${getGameCode()}`;
        const data = await QRCode.toDataURL(link, { width: 220, margin: 1 });
        setQrStart(data);
      } catch(e) { console.error(e); }
    })();
  }, []);

  function buildLinkFor(c){
    const code = getGameCode();
    return `${location.origin}${location.pathname}?g=${code}&pre=${c.id}`;
  }
  useEffect(()=>{
    if(!hostMode) return;
    (async ()=>{
      try{
        const entries = await Promise.all(CHARACTERS.map(async c=>{
          const data = await QRCode.toDataURL(buildLinkFor(c), { width: 220, margin: 1 });
          return [c.id, data];
        }));
        setQrMap(Object.fromEntries(entries));
      }catch(e){ console.error('QR error', e); setQrMap({}) }
    })();
  },[hostMode]);

  async function publish(){
    await upsertPlayer({
      name, gender,
      hero_id: hero?.id || null, hero_name: hero?.name || null,
      monster_id: monster?.id || null, monster_name: monster?.name || null,
      ability_id: ability?.id || null,
      ability_title: ability ? (ability.ownerName + ' — ' + ability.title) : null,
      updated_at: new Date().toISOString()
    });
  }

  function randItem(arr){ return arr[Math.floor(Math.random()*arr.length)] }

  function startGame(e){
    e.preventDefault();
    if(!name.trim()) return;
    const drawn = presetHero || randItem(CHARACTERS.filter(c => c.sex === gender));
    setHero(drawn); setStep('hero'); setFocus('center'); setAbilityOpen(false);
    const giveMonster = Math.random() < 0.35;
    if(giveMonster) setMonster(randItem(MONSTERS)); else setMonster(null);
    setTimeout(publish, 0);
  }

  function onHeroClick(){
    if(step==='hero'){
      setStep('hero-placed'); setFocus('left');
      if(monster) setTimeout(()=>{ setStep('monster'); setFocus('center') }, 450);
      else setTimeout(()=> triggerAlert(), 400);
      setTimeout(publish, 0);
    } else {
      setZoom(z => z==='left' ? null : 'left');
    }
  }
  function onMonsterClick(){
    if(step==='monster'){
      setStep('monster-placed'); setFocus('center');
      setTimeout(()=> triggerAlert(), 400);
      setTimeout(publish, 0);
    } else {
      setZoom(z => z==='center' ? null : 'center');
    }
  }

  function triggerAlert(){
    setShowOverlay(true); setShowAlert(true);
    setTimeout(()=>{
      setShowAlert(false); setTyping(''); let i=0;
      clearInterval(typingTimer.current);
      typingTimer.current = setInterval(()=>{
        i++; setTyping(fullText.slice(0,i));
        if(i>=fullText.length) clearInterval(typingTimer.current);
      }, 70);
    }, 4000);
  }
  function onOverlayClick(){
    if(typing.length < fullText.length) return;
    if(hero && !ability){
      const good = GOOD_ABILITIES.find(a => a.id === hero.abilityKey) || randItem(GOOD_ABILITIES);
      setAbility({ ...good, ownerName: hero.name });
    }
    if(monster && !ability){
      const ma = MONSTER_ABILITIES[Math.floor(Math.random()*MONSTER_ABILITIES.length)];
      setAbility({ ...ma, ownerName: monster.name });
    }
    setShowOverlay(false); setStep('ability'); setFocus('right'); setAbilityOpen(true);
    setTimeout(publish, 0);
  }

  function onAbilityClick(){
    if(step==='ability'){
      setStep('done'); setAbilityOpen(false); setFocus('right');
      setTimeout(publish, 0);
    } else {
      setAbilityOpen(v=>!v);
    }
  }

  function togglePlaced(where){ setFocus(f=> f===where ? 'center' : where ) }
  function resetAll(){
    localStorage.removeItem(LS.hero);
    localStorage.removeItem(LS.monster);
    localStorage.removeItem(LS.ability);
    localStorage.removeItem(LS.step);
    setHero(null); setMonster(null); setAbility(null); setStep('start'); setAbilityOpen(false);
    setTimeout(publish, 0);
  }

  const previewAbility = hero ? GOOD_ABILITIES.find(a=>a.id===hero.abilityKey) : null;
  const showPreview = previewAbility && previewAbility.id !== 'citizen';

  function newCode(){ localStorage.removeItem('game:code'); location.reload(); }
  async function copy(text){ try{ await navigator.clipboard.writeText(text) }catch{} }
  function openQR(c){ setQrBig({ name:c.name, data: qrMap[c.id], link: buildLinkFor(c) }) }

  // obraz do karty ZDOLNOŚCI – portret właściciela
  const abilityOwnerImg =
    ability?.ownerName && monster?.name === ability.ownerName ? monster?.img
    : ability?.ownerName && hero?.name === ability.ownerName ? hero?.img
    : '/assets/ability.jpg';

  return (
    <div className="app">

      {/* HOST */}
      {hostMode && (
        <div className="host">
          <div className="host-header">
            Panel Mistrza Gry — kod gry: {getGameCode()} {rtEnabled ? '' : '(realtime wyłączony)'}
          </div>

          <div className="host-actions">
            <button className="btn" onClick={()=>copy(`${location.origin}${location.pathname}?g=${getGameCode()}`)}>Kopiuj link do gry</button>
            <button className="btn" onClick={newCode}>Nowy kod gry</button>
          </div>

          <ul>
            {players.map(p=>(
              <li key={p.player_id}>
                <b>{p.name}</b> ({p.gender}) — {p.hero_name || '—'}
                {p.monster_name ? ` + ${p.monster_name}` : ''}
                {p.ability_title ? ` — ${p.ability_title}` : ''}
              </li>
            ))}
          </ul>

          <div style={{marginTop:8, fontWeight:700}}>QR bohaterów (kliknij aby powiększyć):</div>
          <div className="host-qr">
            {CHARACTERS.map(c=>(
              <div className="qr-card" key={c.id} onClick={()=>openQR(c)} title={c.name}>
                {qrMap[c.id] ? <img src={qrMap[c.id]} alt={`QR ${c.name}`} /> : <span className="small">generuję…</span>}
                <span className="small">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {qrBig && (
        <div className="qr-modal" onClick={()=>setQrBig(null)}>
          <div className="qr-box" onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:700, marginBottom:8}}>{qrBig.name}</div>
            <img src={qrBig.data} alt={`QR ${qrBig.name}`} />
            <div style={{marginTop:10, display:'flex', gap:8, justifyContent:'center'}}>
              <button className="btn" onClick={()=>copy(qrBig.link)}>Kopiuj link</button>
              <button className="btn" onClick={()=>setQrBig(null)}>Zamknij</button>
            </div>
          </div>
        </div>
      )}

      {/* START */}
      {step==='start' && (
        <div className="start">
          <div className="top-blur">
            <form className="form" onSubmit={startGame}>
              <div style={{fontWeight:700, marginRight:8}}>Wpisz imię i nazwisko gracza oraz płeć:</div>
              <input type="text" placeholder="Imię i nazwisko" value={name} onChange={e=>setName(e.target.value)} />
              <div className="gender">
                <label><input type="radio" name="gender" value="K" checked={gender==='K'} onChange={e=>setGender(e.target.value)} /> Kobieta</label>
                <label><input type="radio" name="gender" value="M" checked={gender==='M'} onChange={e=>setGender(e.target.value)} style={{marginLeft:10}}/> Mężczyzna</label>
              </div>
              <button className="btn" disabled={!name.trim()} type="submit">Losuj kartę</button>
            </form>
          </div>

          {qrStart && (
            <div className="start-qr">
              <img src={qrStart} alt="QR do uruchomienia na telefonie" />
              <span className="small">Zeskanuj, aby otworzyć na telefonie</span>
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      {step!=='start' && (
        <div className="table">
          <div className="table-surface" />

          {/* BOHATER */}
          {hero && (
            <div
              className={[
                'card',
                focus==='left'?'focus':'',
                (step==='hero' || zoom==='left') ? 'centered zoom' : 'at-left'
              ].join(' ')}
              onClick={onHeroClick}
              style={{ zIndex: (step==='hero' || zoom==='left') ? 9800 : (focus==='left' ? 1200 : 800) }}
            >
              <div className="media">
                <SmartImg src={hero.img} id={hero.id} name={hero.name} />
              </div>
              <div className="body">
                <h3>{hero.name}</h3>
                <div className="role">{hero.role}</div>
                <div className="meta">
                  <div><b>Co robi?</b> {hero.what}</div>
                  {step!=='hero' && showPreview && (
                    <div className="small" style={{marginTop:6}}>
                      <b>Zdolność:</b> {previewAbility.title.replace(/^.*—\s*/,'')} — {previewAbility.description}
                    </div>
                  )}
                </div>
                <div className="action"><button type="button">{step==='hero' ? 'Odłóż kartę na stół' : (zoom==='left' ? 'Schowaj' : 'Powiększ')}</button></div>
              </div>
            </div>
          )}

          {/* POTWÓR */}
          {monster && (
            <div
              className={[
                'card',
                focus==='center'?'focus':'',
                (step==='monster' || zoom==='center') ? 'centered zoom' : 'at-center'
              ].join(' ')}
              onClick={onMonsterClick}
              style={{ zIndex: (step==='monster' || zoom==='center') ? 9800 : (focus==='center' ? 1200 : 900) }}
            >
              <div className="media">
                <SmartImg src={monster.img} id={monster.id} name={monster.name} />
              </div>
              <div className="body">
                <h3>{monster.name}</h3>
                <div className="role">Potwór</div>
                <div className="meta"><div><b>Co robi?</b> {monster.what}</div></div>
                <div className="action"><button type="button">{step==='monster' ? 'Odłóż kartę na stół' : (zoom==='center' ? 'Schowaj' : 'Powiększ')}</button></div>
              </div>
            </div>
          )}

          {/* ZDOLNOŚĆ — z obrazem właściciela */}
          {ability && (
            <div
              className={[
                'card','ability', focus==='right'?'focus':'',
                (step==='ability' || abilityOpen) ? 'centered zoom' : 'at-right'
              ].join(' ')}
              onClick={onAbilityClick}
              style={{ zIndex: (step==='ability' || abilityOpen) ? 9800 : 1300 }}
            >
              <div className="media">
                <SmartImg src={abilityOwnerImg} id="ability-owner" name="Zdolność" />
              </div>
              <div className="body">
                <h3>{`Zdolność: ${ability.ownerName} — ${ability.title.replace(/^.*—\s*/,'')}`}</h3>
                <div className="role">Karta zdolności</div>
                <div className="meta"><p>{ability.description}</p></div>
                <div className="action"><button type="button">{step==='ability' ? 'Odłóż kartę na stół' : (abilityOpen ? 'Schowaj' : 'Pokaż')}</button></div>
              </div>
            </div>
          )}

          {/* OVERLAY (nad wszystkim) */}
          {showOverlay && (
            <div className="overlay" onClick={onOverlayClick}>
              <div className="smoke"></div>
              {showAlert
                ? <div className="alert">Ludzie uważajcie!</div>
                : <div className="typewriter">{typing}<span className="cursor"></span></div>}
            </div>
          )}

          <div style={{ position:'absolute', top:12, right:12, opacity:.7, fontSize:12 }}>
            <button onClick={resetAll} className="btn" style={{padding:'6px 10px'}}>RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}
