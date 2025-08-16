import React, { useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRStarter() {
  const [url, setUrl] = useState('')
  const [custom, setCustom] = useState('')

  useEffect(() => {
    // Domyślnie podpowiedz aktualny adres (po wdrożeniu w Netlify będzie to URL aplikacji)
    const u = window.location.href
    setUrl(u)
    setCustom(u)
  }, [])

  const qrValue = useMemo(() => custom || url, [custom, url])

  return (
    <section className="rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-4">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-white">Start dla graczy — Kod QR</div>
          <p className="mt-1 max-w-prose text-sm text-zinc-400">
            Ten kod prowadzi do tej strony. Po wdrożeniu w Netlify odśwież stronę, a QR będzie wskazywał właściwy adres.
            Możesz też wkleić własny link poniżej.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              className="w-[22rem] max-w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-600"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="https://twoja-domena.netlify.app"
            />
            <button
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              onClick={() => setCustom(url)}
              title="Ustaw na aktualny adres"
            >
              Użyj adresu strony
            </button>
          </div>
        </div>
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG value={qrValue || 'https://example.com'} size={180} />
        </div>
      </div>
    </section>
  )
}
