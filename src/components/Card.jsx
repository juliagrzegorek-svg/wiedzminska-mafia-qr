import React from 'react'

export default function Card({ item, ability=false, focused, onClick }){
  return (
    <div className={['card', ability ? 'ability':'' , focused?'focus':''].join(' ')} onClick={onClick}>
      <div className="media">
        {item.img && <img src={item.img} alt={item.name} />}
        <div className="frame" />
      </div>
      <div className="body">
        <h3>{ability ? `Zdolność: ${item.ownerName} — ${item.title}` : item.name}</h3>
        <div className="role">{ability ? 'Karta zdolności' : `${item.role || ''}`}</div>
        <div className="meta">
          {ability ? <p>{item.description}</p> : <>
            <div><b>Co robi?</b> {item.what}</div>
            {item.abilityText && <div className="small" style={{marginTop:6}}>{item.abilityText}</div>}
          </>}
        </div>
        <div className="action"><button type="button">Kliknij kartę</button></div>
      </div>
    </div>
  )
}
