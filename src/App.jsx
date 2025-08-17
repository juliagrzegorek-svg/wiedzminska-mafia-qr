import React, { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { CHARACTERS } from './data/characters.js'
import { MONSTERS } from './data/monsters.js'
import { GOOD_ABILITIES, MONSTER_ABILITIES } from './data/abilities.js'
import { rtEnabled, upsertPlayer, subscribePlayers, getGameCode } from './realtime.js'

const LS = {
  name: 'player:name', gender: 'player:gender',
  hero: 'player:hero', monster: 'player:monster', ability: 'player:ability',
  step: 'player:step'
}

/* utils */
function randItem(arr){ return arr[Math.floor(Math.random()*arr.length)] }
const slugify = s => s?.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
const detectHost = () => {
  const u = new URL(window.location.href)
  return u.searchParams.get('host') === '1' || u.hash.replace('#','').includes('host')
}
const params = new URLSearchParams(location.search)
const presetHeroId = params.get('pre') || null

/* obraz z twardymi fallbackami (bez ramki) */
function SmartImg({ src, kind, id, name }){
  const [i,setI] = useState(0)
  const bases = useMemo(()=>{
    const list = []
    if(src) list.push(src)
    const slug = slugify(name)
    const first = slug?.split('-')[0]
    list.push(`/${kind}/${id}`)
    if(slug) list.push(`/${kind}/${slug}`)
    if(first && first!==slug) list.push(`/${kind}/${first}`)
    return list
  }, [src, kind, id, name])
  const exts = ['.png','.jpg','.jpeg','.webp']
  const sources = useMemo(()=>{
    const out=[]; for(const b of bases){ if(/\.(png|jpe?g|webp)$/i.test(b)) out.push(b); else exts.forEach(e=>out.push(b+e)) } return out
  }, [bases])
  const real = sources[Math.min(i, sources.length-1)]
  return <img src={real} alt={name} onError={()=>setI(v=>v+1)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center'}}/>
}

export default function App(){
  const [hostMode,setHostMode] = useState(detectHost())
  useEffect(()=>{ const onHash=()=>setHostMode(detectHost()); window.addEventListener('hashchange',onHash); return ()=>window.removeEventListener('hashchange',onHash) },[])

  const [name,setName] = useState(localStorage.getItem(LS.name) || '')
  const [gender,setGender] = useState(localStorage.getItem(LS.gender) || 'K')

  const [hero,setHero] = useState(()=> JSON.parse(localStorage.getItem(LS.hero) || 'null'))
  const [monster,setMonster] = useState(()=> JSON.parse(localStorage.getItem(LS.monster) || 'null'))
  const [ability,setAbility] = useState(()=> JSON.parse(localStorage.getItem(LS.ability) || 'null'))
  const [step,setStep] = useState(localStorage.getItem(LS.step) || 'start')
  const [abilityOpen,setAbilityOpen] = useState(false)

  const [focus,setFocus] = useState('center')
  const [showOverlay,setShowOverlay] = useState(false)
  const [showAlert,setShowAlert] = useState(false)
  const [typing,setTyping] = useState('')

  const [players,setPlayers] = useState([])
  const [qrMap,setQrMap] = useState({})
  const [qrBig,setQrBig]   = useState(null) // {name, data, link}

  const fullText = 'W dzisiejszym jedzeniu został wykryty eliksir, który sprawił, że zdolności bohaterów pomieszały się. Czy Yen to Yen? Czy Emhyr wciąż może okazać łaskę?'
  const typingTimer = useRef(null)

  const presetHero = useMemo(()=> CHARACTERS.find(c=>c.id===presetHeroId) || null, [])
  useEffect(()=>{ if(presetHero) setGender(presetHero.sex) },[presetHero])

  /* persist */
  useEffect(()=>{ localStorage.setItem(LS.name, name) },[name])
  useEffect(()=>{ localStorage.setItem(LS.gender, gender) },[gender])
  useEffect(()=>{ localStorage.setItem(LS.step, step) },[step])
  useEffect(()=>{ hero && localStorage.setItem(LS.hero, JSON.stringify(hero)) },[hero])
  useEffect(()=>{ monster && localStorage.setItem(LS.monster, JSON.stringify(monster)) },[monster])
  useEffect(()=>{ ability && localStorage.setItem(LS.ability, JSON.stringify(ability)) },[ability])

  /* realtime host (opcjonalnie) */
  useEffect(()=>{
    if(!hostMode || !rtEnabled) return
    const un = subscribePlayers(setPlayers)
    return () => un && un()
  },[hostMode])

  /* QR dla hosta */
  function buildLinkFor(c){
    const code = getGameCode()
    return `${location.origin}${location.pathname}?g=${code}&pre=${c.id}`
  }
  useEffect(()=>{
    if(!hostMode) return
    (async ()=>{
      try{
        const entries = await Promise.all(CHARACTERS.map(async c=>{
          const data = await QRCode.toDataURL(buildLinkFor(c), { width: 220, margin: 1 })
          return [c.id, data]
        }))
        setQrMap(Object.fromEntries(entries))
      }catch(e){ console.error('QR error', e); setQrMap({}) }
    })()
  },[hostMode])

  async function publish(){
    await upsertPlayer({
      name, gender,
      hero_id: hero?.id || null,
      hero_name: hero?.name || null,
      monster_id: monster?.id || null,
      monster_name: monster?.name || null,
      ability_id: ability?.id || null,
      ability_title: ability ? (ability.ownerName + ' — ' + ability.title) : null,
      updated_at: new Date().toISOString()
    })
  }

  function startGame(e){
    e.preventDefault()
    if(!name.trim()) return
    const drawn = presetHero || randItem(CHARACTERS.filter(c => c.sex === gender))
    setHero(drawn); setStep('hero'); setFocus('center'); setAbilityOpen(false)
    const giveMonster = Math.random() < 0.35
    if(giveMonster) setMonster(randItem(MONSTERS)); else setMonster(null)
    setTimeout(publish, 0)
  }

  function onHeroClick(){
    if(step==='hero'){
      setStep('hero-placed'); setFocus('left')
      if(monster) setTimeout(()=>{ setStep('monster'); setFocus('center') }, 450)
      else setTimeout(()=> triggerAlert(), 400)
      setTimeout(publish, 0)
    }
  }
  function onMonsterClick(){
    if(step==='monster'){
      setStep('monster-placed'); setFocus('center')
      setTimeout(()=> triggerAlert(), 400)
      setTimeout(publish, 0)
    }
  }

  function triggerAlert(){
    setShowOverlay(true); setShowAlert(true)
    setTimeout(()=>{
      setShowAlert(false); setTyping(''); let i=0
      clearInterval(typingTimer.current)
      typingTimer.current = setInterval(()=>{
        i++; setTyping(fullText.slice(0,i))
        if(i>=fullText.length) clearInterval(typingTimer.current)
      }, 70) // wolniej
    }, 4000) // napis 4s
  }
  function onOverlayClick(){
    if(typing.length < fullText.length) return
    if(hero && !ability){
      const good = GOOD_ABILITIES.find(a => a.id === hero.abilityKey) || randItem(GOOD_ABILITIES)
      setAbility({ ...good, ownerName: hero.name })
    }
    if(monster && !ability){
      const ma = randItem(MONSTER_ABILITIES)
      setAbility({ ...ma, ownerName: monster.name })
    }
    setShowOverlay(false); setStep('ability'); setFocus('right'); setAbilityOpen(true)
    setTimeout(publish, 0)
  }

  function onAbilityClick(){
    if(step==='ability'){
      setStep('done'); setAbilityOpen(false); setFocus('right')
      setTimeout(publish, 0)
    } else if(step==='done'){
      setAbilityOpen(v=>!v)
    }
  }

  function togglePlaced(where){ setFocus(f=> f===where ? 'center' : where ) }
  function resetAll(){
    localStorage.removeItem(LS.hero); localStorage.removeItem(LS.monster)
    localStorage.removeItem(LS.ability); localStorage.removeItem(LS.step)
    setHero(null); setMonster(null); setAbility(null); setStep('start'); setAbilityOpen(false)
    setTimeout(publish, 0)
  }

  const previewAbility = hero ? GOOD_ABILITIES.find(a=>a.id===hero.abilityKey) : null
  const showPreview = previewAbility && previewAbility.id !== 'citizen'

  /* HOST actions */
  function newCode(){
    localStorage.removeItem('game:code')
    location.reload()
  }
  function openQR(c){
    setQrBig({ name:c.name, data: qrMap[c.id], link: buildLinkFor(c) })
  }
  async function copy(text){ try{ await navigator.clipboard.writeText(text) }catch{} }

  return (
    <div className="app">

      {/* HOST PANEL */}
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

      {/* powiększony QR */}
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

      {/* GRACZ */}
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
        </div>
      )}

      {step!=='start' && (
        <div className="table">
          <div className="table-surface" />

          {/* BOHATER */}
          {hero && (step==='hero' || step==='hero-placed' || step==='monster' || step==='monster-placed' || step==='ability' || step==='done') && (
            <div
              className={[
                'card',
                focus==='left'?'focus':'',
                step==='hero' ? 'centered zoom' : 'at-left'
              ].join(' ')}
              onClick={step==='hero' ? onHeroClick : ()=>togglePlaced('left')}
              style={{ zIndex: focus==='left'? 40: 10 }}
            >
              <div className="media">
                <SmartImg src={hero.img} kind="characters" id={hero.id} name={hero.name} />
              </div>
              <div className="body">
                <h3>{hero.name}</h3>
                <div className="role">{hero.role}</div>
                <div className="meta">
                  <div><b>Co robi?</b> {hero.what}</div>
                  {showPreview && (
                    <div className="small" style={{marginTop:6}}>
                      <b>Zdolność:</b> {previewAbility.title.replace(/^.*—\s*/,'')} — {previewAbility.description}
                    </div>
                  )}
                </div>
                <div className="action"><button type="button">{step==='hero' ? 'Odłóż kartę na stół' : 'Powiększ/Schowaj'}</button></div>
              </div>
            </div>
          )}

          {/* POTWÓR */}
          {monster && (step==='monster' || step==='monster-placed' || step==='ability' || step==='done') && (
            <div
              className={[
                'card',
                focus==='center'?'focus':'',
                step==='monster' ? 'centered zoom' : 'at-center'
              ].join(' ')}
              onClick={step==='monster' ? onMonsterClick : ()=>togglePlaced('center')}
              style={{ zIndex: focus==='center'? 40: 9 }}
            >
              <div className="media">
                <SmartImg src={monster.img} kind="monsters" id={monster.id} name={monster.name} />
              </div>
              <div className="body">
                <h3>{monster.name}</h3>
                <div className="role">Potwór</div>
                <div className="meta"><div><b>Co robi?</b> {monster.what}</div></div>
                <div className="action"><button type="button">{step==='monster' ? 'Odłóż kartę na stół' : 'Powiększ/Schowaj'}</button></div>
              </div>
            </div>
          )}

          {/* ZDOLNOŚĆ */}
          {ability && (step==='ability' || step==='done') && (
            <div
              className={[
                'card','ability', focus==='right'?'focus':'',
                (step==='ability' || abilityOpen) ? 'centered zoom' : 'at-right'
              ].join(' ')}
              onClick={onAbilityClick}
              style={{ zIndex: 2000 }}
            >
              <div className="media">
                <img src="/assets/ability.jpg" alt="Zdolność" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
              </div>
              <div className="body">
                <h3>{`Zdolność: ${ability.ownerName} — ${ability.title.replace(/^.*—\s*/,'')}`}</h3>
                <div className="role">Karta zdolności</div>
                <div className="meta"><p>{ability.description}</p></div>
                <div className="action"><button type="button">{step==='ability' ? 'Odłóż kartę na stół' : (abilityOpen ? 'Schowaj' : 'Pokaż')}</button></div>
              </div>
            </div>
          )}

          {/* OVERLAY */}
          {showOverlay && (
            <div className="overlay" onClick={onOverlayClick}>
              <div className="smoke"></div>
              {showAlert ? <div className="alert">Ludzie uważajcie!</div> : <div className="typewriter">{typing}<span className="cursor"></span></div>}
            </div>
          )}

          <div style={{ position:'absolute', top:12, right:12, opacity:.7, fontSize:12 }}>
            <button onClick={resetAll} className="btn" style={{padding:'6px 10px'}}>RESET</button>
          </div>
        </div>
      )}
    </div>
  )
}
