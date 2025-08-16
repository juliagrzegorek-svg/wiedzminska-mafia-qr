import React from 'react'
import WitcherDeck from './components/WitcherDeck.jsx'
import QRStarter from './components/QRStarter.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Szepty Lasu — Wiedźmińska Mafia</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Zeskanuj QR, by dołączyć. Otwórz talię, aby przejrzeć bohaterów, potwory i funkcje. 
            W scenariuszu z eliksirem funkcje są pomieszane — porównasz pary w panelu talii.
          </p>
        </header>
        <QRStarter />
      </div>
      <WitcherDeck />
    </div>
  )
}
