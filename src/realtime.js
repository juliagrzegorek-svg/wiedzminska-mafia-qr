// === src/realtime.js ===
// Proste "realtime" na Google Sheets Web App (za darmo).

// WSTAW TU swój link z kroku A:
const ENDPOINT = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjB5CokAGEs94yI3O2n3PtXOxOfjrHWeVoMd3y1Nz4OlmgC8tNGH0erqgOc7-bTbqL9_CLiLgipYFrQqB-osr1pP83DnmQez277E4K21yQqP4GBQPWdH1pWlOdjMsCXzOs0Be1knh7S-AavFsuMRq9lGQiPWjyGNKCMe4eBMkj-hSHy9TKBdd0F7h8GAOWAqsu9o3xEKrOe50CetZV05wYaFwSNWbzxNu24vUdt1HF_WvRYAo-f5MwDJ43NojYAc_0lIt9wguH2lm8JuZU6BKxK8XVgWKySuTVrWHWR&lib=M53C55S4tLOwHd2_Y9CFRKDU0Ve2EI9Xr';

export const rtEnabled = true;

export function getGameCode() {
  const k = 'game:code';
  let code = localStorage.getItem(k);
  if (!code) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem(k, code);
  }
  return code;
}

const PLAYER_ID_KEY = 'game:player-id';
function getPlayerId(){
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

// Zapis/aktualizacja gracza — zapisujemy KAŻDĄ zmianę stanu
export async function upsertPlayer(row) {
  const payload = {
    ...row,
    game_code: getGameCode(),
    player_id: getPlayerId(),
  };
  // Uwaga: brak nagłówków → simple request (bez CORS preflight)
  try {
    await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(payload) });
  } catch (e) {
    // cicho
  }
}

// "subskrypcja" — polling co 2 sek.
export function subscribePlayers(set, { pollMs = 2000 } = {}) {
  let stopped = false;
  async function tick() {
    if (stopped) return;
    try {
      const res = await fetch(`${ENDPOINT}?g=${encodeURIComponent(getGameCode())}`);
      const data = await res.json();
      set(Array.isArray(data.rows) ? data.rows : []);
    } catch (e) {
      // cicho
    }
    setTimeout(tick, pollMs);
  }
  tick();
  return () => { stopped = true; };
}
