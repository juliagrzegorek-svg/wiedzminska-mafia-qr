import React, { useEffect, useRef, useState } from 'react'
import { CHARACTERS } from './data/characters.js'
import { MONSTERS } from './data/monsters.js'
import { GOOD_ABILITIES, MONSTER_ABILITIES } from './data/abilities.js'

const LS = {
  name: 'player:name', gender: 'player:gender',
  hero: 'player:hero', monster: 'player:monster', ability: 'player:ability',
  step: 'player:step'
}

function randItem(arr){ return arr[Math.floor(Math.random()*arr.length)] }

export default function App(){
  const [name,setName] = useState(localStorage.getItem(LS.name) || '')
  const [gender,setGender] = useState(localStorage.getItem(LS.gender) || 'K')

  const [hero,setHero] = useState(()=> JSON.parse(localStorage.getItem(LS.hero) || 'null'))
  const [monster,setMonster] = useState(()=> JSON.parse(localStorage.getItem(LS.monster) || 'null'))
  const [ability,setAbility] = useState(()=> JSON.parse(localStorage.getItem(LS.ability) || 'null'))
  const [step,setStep] = useState(localStorage.getItem(LS.step) || 'start')

  const [focus,setFocus] = useState('center') // 'center'|'left'|'right'
  const [showOverlay,setShowOverlay] = useState(false)
  const [showAlert,setShowAlert] = useState(false)
  const [typing,setTyping] = useState('')

  const fullText = 'W dzisiejszym jedzeniu został wykryty eliksir, który sprawił, że zdolności bohaterów pomieszały się. Czy Yen to Yen? Czy Emhyr wciąż może okazać łaskę?'
  const typingTimer = useRef(null)

  // persist
  useEffect(()=>{ localStorage.setItem(LS.name, name) },[name])
  useEffect(()=>{ localStorage.setItem(LS.gender, gender) },[gender])
  useEffect(()=>{ localStorage.setItem(LS.step, step) },[step])
  useEffect(()=>{ hero && localStorage.setItem(LS.hero, JSON.stringify(hero)) },[hero])
  useEffect(()=>{ monster && localStorage.setItem(LS.monster, JSON.stringify(monster)) },[monster])
  useEffect(()=>{ ability && localStorage.setItem(LS.ability, JSON.stringify(ability)) },[ability])

  function startGame(e){
    e.preventDefault()
    if(!name.trim()) return
    const pool = CHARACTERS.filter(c => c.sex === gender)
    const drawn = randItem(pool)
    setHero(drawn)
    setStep('hero')
    setFocus('center')
    const giveMonster = Math.random() < 0.35 // zmień na true aby zawsze był potwór
    if(giveMonster) setMonster(randItem(MONSTERS))
    else setMonster(null)
  }

  function onHeroClick(){
    if(step==='hero'){
      setStep('hero-placed')
      setFocus('left')
      if(monster) setTimeout(()=> setStep('monster'), 450)
      else setTimeout(()=> triggerAlert(), 400)
    }
  }

  function onMonsterClick(){
    if(step==='monster'){
      setStep('monster-placed')
      setFocus('center')
      setTimeout(()=> triggerAlert(), 400)
    }
  }

   function triggerAlert(){
    setShowOverlay(true)
    setShowAlert(true)
-   setTimeout(()=>{
+   setTimeout(()=>{
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
-   }, 1200) // smoke anim
+   }, 4000) // pokazuj „Ludzie uważajcie!” ~4s
  }


  function onOverlayClick(){
    if(typing.length < fullText.length) return
    if(hero && !ability){
      const good = randItem(GOOD_ABILITIES)
      setAbility({ ...good, ownerName: hero.name })
    }
    if(monster && !ability){
      const ma = randItem(MONSTER_ABILITIES)
      setAbility({ ...ma, ownerName: monster.name })
    }
    setShowOverlay(false)
    setStep('ability')
    setFocus('right')
  }

  function onAbilityClick(){
    if(step==='ability'){
      setStep('done')
      setFocus('right')
    }
  }

  function togglePlaced(where){
    setFocus(f=> f===where ? 'center' : where )
  }

  function resetAll(){
    localStorage.removeItem(LS.hero)
    localStorage.removeItem(LS.monster)
    localStorage.removeItem(LS.ability)
    localStorage.removeItem(LS.step)
    setHero(null); setMonster(null); setAbility(null); setStep('start')
  }

  return (
    <div className="app">
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
                <img src={hero.img} alt={hero.name} />
                <div className="frame" />
              </div>
              <div className="body">
                <h3>{hero.name}</h3>
                <div className="role">{hero.role}</div>
                <div className="meta"><div><b>Co robi?</b> {hero.what}</div></div>
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
                <img src={monster.img} alt={monster.name} />
                <div className="frame" />
              </div>
              <div className="body">
                <h3>{monster.name}</h3>
                <div className="role">Potwór</div>
                <div className="meta"><div><b>Co robi?</b> {monster.what}</div></div>
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
                <h3>{`Zdolność: ${ability.ownerName} — ${ability.title.replace(/^.*—\\s*/,'')}`}</h3>
                <div className="role">Karta zdolności</div>
                <div className="meta"><p>{ability.description}</p></div>
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
