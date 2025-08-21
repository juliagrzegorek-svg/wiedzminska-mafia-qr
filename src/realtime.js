// === src/realtime.js ===
import { createClient } from '@supabase/supabase-js';

// ENV z Netlify (lub .env lokalnie)
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Realtime włączone tylko, jeżeli oba ENV istnieją
export const rtEnabled = Boolean(URL && KEY);

// Stały kod gry (5 znaków), wspólny dla wszystkich w tej sesji
export function getGameCode() {
  let code = localStorage.getItem('game:code');
  if (!code) {
    const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    code = Array.from({ length: 5 }, () => ABC[Math.floor(Math.random() * ABC.length)]).join('');
    localStorage.setItem('game:code', code);
  }
  return code;
}

// Stałe ID urządzenia (jeden gracz = jedno urządzenie)
function getPlayerId() {
  let id = localStorage.getItem('player:id');
  if (!id) {
    id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + Date.now().toString(36);
    localStorage.setItem('player:id', id);
  }
  return id;
}

// Klient Supabase tylko, jeżeli mamy ENV
let supa = null;
if (rtEnabled) {
  supa = createClient(URL, KEY, {
    realtime: { params: { eventsPerSecond: 2 } },
  });
}

// ——— API używane w App.jsx ———

// upsert w tabeli players (albo no-op gdy rt wyłączony)
export async function upsertPlayer(row) {
  const payload = {
    ...row,
    game_code: getGameCode(),
    player_id: getPlayerId(),
  };
  if (!rtEnabled) return payload;
  await supa.from('players').upsert(payload, { onConflict: 'game_code,player_id' });
  return payload;
}

// subskrypcja listy graczy (albo pusta, gdy rt wyłączony)
export function subscribePlayers(setter) {
  if (!rtEnabled) {
    setter([]);           // pokaż pustą tabelę, ale panel hosta działa
    return () => {};
  }

  const load = async () => {
    const { data } = await supa
      .from('players')
      .select('*')
      .eq('game_code', getGameCode())
      .order('updated_at', { ascending: false });
    setter(data || []);
  };

  // pierwsze pobranie
  load();

  // realtime
  const channel = supa
    .channel('players-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `game_code=eq.${getGameCode()}` },
      () => load()
    )
    .subscribe();

  return () => supa.removeChannel(channel);
}
