// src/realtime.js
import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// RT włączony tylko gdy mamy poprawne envy
export const rtEnabled = !!(URL && KEY);

export function getGameCode() {
  const k = 'game:code';
  let code = localStorage.getItem(k);
  if (!code) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem(k, code);
  }
  return code;
}

const supabase = rtEnabled ? createClient(URL, KEY) : null;

function getPlayerId() {
  const k = 'player:id';
  let id = localStorage.getItem(k);
  if (!id) {
    id = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(k, id);
  }
  return id;
}

export async function upsertPlayer(row) {
  if (!rtEnabled) return;
  const payload = {
    ...row,
    game_code: getGameCode(),
    player_id: getPlayerId(),
  };

  // upsert po (game_code, player_id)
  const { error } = await supabase
    .from('players')
    .upsert(payload, { onConflict: 'game_code,player_id' });
  if (error) {
    // opcjonalnie: pokaż w konsoli jeśli np. zadziałał unikalny indeks na hero/ability
    console.warn('upsertPlayer error:', error.message);
  }
}

export function subscribePlayers(set) {
  if (!rtEnabled) { set([]); return () => {}; }

  const gc = getGameCode();
  let disposed = false;

  const refresh = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_code', gc)
      .order('updated_at', { ascending: false });
    if (!disposed && !error && data) set(data);
  };

  // 1) pierwszy zrzut danych
  refresh();

  // 2) realtime (INSERT/UPDATE/DELETE dla tej gry)
  const channel = supabase
    .channel(`players-${gc}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `game_code=eq.${gc}` },
      () => refresh()
    )
    .subscribe();

  return () => {
    disposed = true;
    supabase.removeChannel(channel);
  };
}
