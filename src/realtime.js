// === src/realtime.js ===
import { createClient } from '@supabase/supabase-js';

// ENV z Netlify/Vite (masz je już ustawione)
const URL  = import.meta.env.VITE_SUPABASE_URL;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const rtEnabled = !!(URL && KEY);
export const supa = rtEnabled ? createClient(URL, KEY, {
  auth: { persistSession: false }
}) : null;

// --- stały kod gry (wspólny dla hosta i graczy) ---
const GC_KEY = 'game:code';
export function getGameCode() {
  const url = new URL(location.href);
  const fromUrl = url.searchParams.get('g');
  if (fromUrl) {
    // nadpisz lokalny i używaj kodu z linku/QR
    localStorage.setItem(GC_KEY, fromUrl);
    return fromUrl;
  }
  let code = localStorage.getItem(GC_KEY);
  if (!code) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem(GC_KEY, code);
  }
  return code;
}

// --- stałe ID urządzenia (żeby upsert działał poprawnie) ---
const PID_KEY = 'player:id';
function getPlayerId() {
  let id = localStorage.getItem(PID_KEY);
  if (!id) {
    id = (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) + '-' + Date.now();
    localStorage.setItem(PID_KEY, id);
  }
  return id;
}

// --- zapis/aktualizacja gracza ---
export async function upsertPlayer(row) {
  if (!rtEnabled) return;
  const payload = {
    game_code: getGameCode(),
    player_id: getPlayerId(),
    ...row,
  };
  // konflikt rozstrzygamy po (game_code, player_id)
  await supa
    .from('players')
    .upsert(payload, { onConflict: 'game_code,player_id' });
}

// --- subskrypcja listy graczy dla hosta ---
export function subscribePlayers(set) {
  if (!rtEnabled) { set([]); return () => {}; }

  const code = getGameCode();

  // 1) wstępne pobranie
  supa.from('players')
    .select('*')
    .eq('game_code', code)
    .order('updated_at', { ascending: false })
    .then(({ data }) => set(data || []));

  // 2) realtime (insert/update/delete)
  const ch = supa.channel('players-' + code)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `game_code=eq.${code}` },
      async () => {
        const { data } = await supa
          .from('players')
          .select('*')
          .eq('game_code', code)
          .order('updated_at', { ascending: false });
        set(data || []);
      }
    )
    .subscribe();

  return () => { supa.removeChannel(ch); };
}
