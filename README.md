# Szepty Lasu — Wiedźmińska Mafia (Vite + React + Tailwind)

Gotowy projekt do wdrożenia na Netlify.

## Lokalne uruchomienie

```bash
npm install
npm run dev
```

## Build produkcyjny

```bash
npm run build
# statyczne pliki znajdziesz w katalogu dist/
```

## Wdrożenie na Netlify — opcja 1 (zalecana: z repozytorium)

1. Utwórz prywatny repozytorium na GitHub/GitLab/Bitbucket i wgraj cały projekt.
2. W Netlify wybierz **Add new site → Import from Git**.
3. Ustaw:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Opcjonalnie) w **Build environment** ustaw `NODE_VERSION = 20`.
4. Deploy.

## Wdrożenie na Netlify — opcja 2 (ręczne przeciągnięcie)

Ta metoda wymaga gotowego katalogu `dist`:
1. Uruchom `npm install` i `npm run build` u siebie lokalnie.
2. Na stronie Netlify wejdź w **Sites → Add new site → Deploy manually**.
3. Przeciągnij **zawartość** katalogu `dist` (lub spakuj `dist` do .zip i przeciągnij ten plik).

## Co jest w środku?

- `src/components/QRStarter.jsx` — generator kodu QR (pokazuje QR do aktualnego adresu strony po wdrożeniu).
- `src/components/WitcherDeck.jsx` — interfejs talii: bohaterowie, potwory, funkcje, parowanie po „eliksirze”.
- Tailwind w układzie CommonJS (`postcss.config.js`, `tailwind.config.js`) — kompatybilny z Netlify.

## Uwaga dot. PostCSS (Netlify)

Jeśli kiedyś zobaczysz błąd *Failed to load PostCSS config: module is not defined in ES module scope*, to znaczy, że
konfig był w ESM. Tu już używamy **CommonJS** (`module.exports = { ... }`), więc błąd nie powinien się pojawić.
