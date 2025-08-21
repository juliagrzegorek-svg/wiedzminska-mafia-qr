// src/realtime.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Realtime włączony TYLKO jeśli są zmienne środowiskowe
export const rtEnabled = !!(SUPABASE_URL && SUPABASE_ANON);

export function getGameCode() {
  const k = 'game:code';
  let code = localStorage.getItem(k);
  if (!code) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem(k, code);
  }
  return code;
}

// Stałe ID urządzenia gracza – do upsertu
const PID_KEY = 'player:id';
function getPlayerId() {
  let pid = localStorage.getItem(PID_KEY);
  if (!pid) {
    pid = 'plr_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(PID_KEY, pid);
  }
  return pid;
}

const supabase = rtEnabled ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;

// Zapis/aktualizacja stanu gracza
export async function upsertPlayer(row) {
  if (!rtEnabled) return;
  const payload = {
    player_id: getPlayerId(),
    game_code: getGameCode(),
    ...row,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from('players')
    .upsert(payload, { onConflict: 'player_id' }); // update po player_id
  if (error) console.warn('upsertPlayer error', error);
}

// Subskrypcja listy graczy dla danego kodu gry (host panel)
export function subscribePlayers(set) {
  if (!rtEnabled) { set([]); return () => {}; }

  const code = getGameCode();

  // initial load
  const load = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('game_code', code)
      .order('updated_at', { ascending: false });
    if (error) { console.warn('load players error', error); return; }
    set(data || []);
  };
  load();

  // realtime
  const channel = supabase
    .channel('players-channel-' + code)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `game_code=eq.${code}` },
      () => load()
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// Zwraca zbiory zajętych ID w obrębie bieżącego game_code
export async function getUsed(code = getGameCode()) {
  if (!rtEnabled) {
    return { heroes: new Set(), monsters: new Set(), abilities: new Set() };
  }
  const { data, error } = await supabase
    .from('players')
    .select('hero_id, monster_id, ability_id')
    .eq('game_code', code);

  if (error) {
    console.warn('getUsed error', error);
    return { heroes: new Set(), monsters: new Set(), abilities: new Set() };
  }

  const heroes = new Set();
  const monsters = new Set();
  const abilities = new Set();
  for (const r of data || []) {
    if (r.hero_id) heroes.add(r.hero_id);
    if (r.monster_id) monsters.add(r.monster_id);
    if (r.ability_id) abilities.add(r.ability_id);
  }
  return { heroes, monsters, abilities };
}
