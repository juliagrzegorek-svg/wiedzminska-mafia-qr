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
const params = new URLSearchParams(location.search)
const presetHeroId = params.get('pre') || null
const hostMode = params.get('host') === '1' || location.hash === '#host'

function randItem(arr){ return arr[Math.floor(Math.random()*arr.length)] }

/** Obraz z fallbackiem rozszerzeń: .png → .jpg → .webp */
function SmartImg({ kind, id, alt }){
  const [i,setI] = useState(0)
  const sources = useMemo(()=>[
    `/${kind}/${id}.png`,
    `/${kind}/${id}.jpg`,
    `/${kind}/${id}.webp`
  ], [kind,id])
  const src = sources[Math.min(i, sources.length-1)]
  return (
    <img
      src={src}
      alt={alt}
      onError={()=> setI(v => v + 1)}
      style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
    />
  )
}

export default function App(){
  const [name,setName] = useState(localStorage.getItem(LS.name) || '')
  const [gender,setGender] = useState(localStorage.getItem(LS.gender) || 'K')

  const [hero,setHero] = useState(()=> JSON.parse(localStorage.getItem(LS.hero) || 'null'))
  const [monster,setMonster] = useState(()=> JSON.parse(localStorage.getItem(LS.monster) || 'null'))
  const [ability,setAbility] = useState(()=> JSON.parse(localStorage.getItem(LS.ability) || 'null'))
  const [step,setStep] = useState(localStorage.getItem(LS.step) || 'start')

  const [focus,setFocus] = useState('center')
  const [showOverlay,setShowOverlay] = useState(false)
  const [showAlert,setShowAlert] = useState(false)
  const [typing,setTyping] = useState('')

  const [players,setPlayers] = useState([])
  const [qrMap,setQrMap] = useState({})

  const fullText = 'W dzisiejszym jedzeniu został wykryty eliksir, który sprawił, że zdolności bohaterów pomieszały się. Czy Yen to Yen? Czy Emhyr wciąż może okazać łaskę?'
  const typingTimer = useRef(null)

  const presetHero = useMemo(()=> CHARACTERS.find(c=>c.id===presetHeroId) || null, [])
  useEffect(()=>{ if(presetHero) setGender(presetHero.sex) },[presetHero])

  useEffect(()=>{ localStorage.setItem(LS.name, name) },[name])
  useEffect(()=>{ localStorage.setItem(LS.gender, gender) },[gender])
  useEffect(()=>{ localStorage.setItem(LS.step, step) },[step])
  useEffect(()=>{ hero && localStorage.setItem(LS.hero, JSON.stringify(hero)) },[hero])
  useEffect(()=>{ monster && localStorage.setItem(LS.monster, JSON.stringify(monster)) },[monster])
  useEffect(()=>{ ability && localStorage.setItem(LS.ability, JSON.stringify(ability)) },[ability])

  useEffect(()=>{
    if(!hostMode || !rtEnabled) return
    const un = subscribePlayers(setPlayers)
    return () => un && un()
  },[hostMode])

  useEffect(()=>{
    if(!hostMode) return
    const code = getGameCode()
    (async ()=>{
      const entries = await Promise.all(CHARACTERS.map(async c=>{
        const link = `${location.origin}${location.pathname}?g=${code}&pre=${c.id}`
        const data = await QRCode.toDataURL(link, { width: 220, margin: 1 })
        return [c.id, data]
      }))
      setQrMap(Object.fromEntries(entries))
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
    let drawn
    if(presetHero) drawn = presetHero
    else {
      const pool = CHARACTERS.filter(c => c.sex === gender)
      drawn = randItem(pool)
    }
    setHero(drawn)
    setStep('hero')
    setFocus('center')

    const giveMonster = Math.random() < 0.35
    if(giveMonster) setMonster(randItem(MONSTERS)); else setMonster(null)

    setTimeout(publish, 0)
  }

  function onHeroClick(){
    if(step==='hero'){
      setStep('hero-placed')
      setFocus('left')
      if(monster){
        setTimeout(()=>{
          setStep('monster')
          setFocus('center')  // ← potwór na wierzchu
        }, 450)
      } else {
        setTimeout(()=> triggerAlert(), 400)
      }
      setTimeout(publish, 0)
    }
  }

  function onMonsterClick(){
    if(step==='monster'){
      setStep('monster-placed')
      setFocus('center')
      setTimeout(()=> triggerAlert(), 400)
      setTimeout(publish, 0)
    }
  }

  function triggerAlert(){
    setShowOverlay(true)
    setShowAlert(true)
    setTimeout(()=>{
      setShowAlert(false)
      setTyping('')
      let i=0
      clearInterval(typingTimer.current)
      typingTimer.current = setInterval(()=>{
        i++
        setTyping(fullText.slice(0,i))
        if(i>=fullText.length){
          clearInterval(typingTimer.current)
        }
      }, 22)
    }, 4000)
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
    setShowOverlay(false)
    setStep('ability')
    setFocus('right')
    setTimeout(publish, 0)
  }

  function onAbilityClick(){
    if(step==='ability'){
      setStep('done')
      setFocus('right')
      setTimeout(publish, 0)
    }
  }

  function togglePlaced(where){ setFocus(f=> f===where ? 'center' : where ) }

  function resetAll(){
    localStorage.removeItem(LS.hero)
    localStorage.removeItem(LS.monster)
    localStorage.removeItem(LS.ability)
    localStorage.removeItem(LS.step)
    setHero(null); setMonster(null); setAbility(null); setStep('start')
    setTimeout(publish, 0)
  }

  const previewAbility = hero ? GOOD_ABILITIES.find(a=>a.id===hero.abilityKey) : null
  const showPreview = previewAbility && previewAbility.id !== 'citizen'

  return (
    <div className="app">

      {/* HOST */}
      {hostMode && (
        <div className="host">
          <div className="host-header">
            Panel Mistrza Gry — kod gry: {getGameCode()} {rtEnabled ? '' : '(realtime wyłączony)'}
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

          <div style={{marginTop:8, fontWeight:700}}>QR bohaterów:</div>
          <div className="host-qr">
            {CHARACTERS.map(c=>(
              <div className="qr-card" key={c.id} title={c.name}>
                <img src={qrMap[c.id]} alt={`QR ${c.name}`} />
                <span className="small">{c.name}</span>
              </div>
            ))}
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

          {hero && (step==='hero' || step==='hero-placed' || step==='monster' || step==='monster-placed' || step==='ability' || step==='done') && (
            <div
              className={['card', focus==='left'?'focus':'', step==='hero'?'':'at-left'].join(' ')}
              onClick={step==='hero' ? onHeroClick : ()=>togglePlaced('left')}
              style={{ zIndex: focus==='left'? 40: 10 }}
            >
              <div className="media">
                <SmartImg kind="characters" id={hero.id} alt={hero.name} />
                <div className="frame" />
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

          {monster && (step==='monster' || step==='monster-placed' || step==='ability' || step==='done') && (
            <div
              className={['card', focus==='center'?'focus':'', step==='monster'?'':'at-center'].join(' ')}
              onClick={step==='monster' ? onMonsterClick : ()=>togglePlaced('center')}
              style={{ zIndex: focus==='center'? 40: 9 }}
            >
              <div className="media">
                <SmartImg kind="monsters" id={monster.id} alt={monster.name} />
                <div className="frame" />
              </div>
              <div className="body">
                <h3>{monster.name}</h3>
                <div className="role">Potwór</div>
                <div className="meta">
                  <div><b>Co robi?</b> {monster.what}</div>
                </div>
                <div className="action"><button type="button">{step==='monster' ? 'Odłóż kartę na stół' : 'Powiększ/Schowaj'}</button></div>
              </div>
            </div>
          )}

          {ability && (step==='ability' || step==='done') && (
            <div
              className={['card','ability', focus==='right'?'focus':'','at-right'].join(' ')}
              onClick={onAbilityClick}
              style={{ zIndex: focus==='right'? 40: 8 }}
            >
              <div className="media">
                <img src="/assets/ability.jpg" alt="Zdolność" />
                <div className="frame" />
              </div>
              <div className="body">
                <h3>{`Zdolność: ${ability.ownerName} — ${ability.title.replace(/^.*—\s*/,'')}`}</h3>
                <div className="role">Karta zdolności</div>
                <div className="meta">
                  <p>{ability.description}</p>
                </div>
                <div className="action"><button type="button">{step==='ability' ? 'Odłóż kartę na stół' : 'Powiększ/Schowaj'}</button></div>
              </div>
            </div>
          )}

          {showOverlay && (
            <div className="overlay" onClick={onOverlayClick}>
              <div className="smoke"></div>
              {showAlert ? (
                <div className="alert">Ludzie uważajcie!</div>
              ) : (
                <div className="typewriter">
                  {typing}<span className="cursor"></span>
                </div>
              )}
            </div>
          )}

          <div style={{ position:'absolute', top:12, right:12, opacity: .7, fontSize:12 }}>
            <button onClick={resetAll} className="btn" style={{padding:'6px 10px'}}>RESET</button>
          </div>
        </div>
      )}
    </div>
  )
}
