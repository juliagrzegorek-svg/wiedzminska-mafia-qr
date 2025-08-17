import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const rtEnabled = !!(url && key)
export const supabase = rtEnabled ? createClient(url, key) : null

export function getGameCode(){
  const params = new URLSearchParams(location.search)
  let code = params.get('g') || localStorage.getItem('game:code')
  if(!code){
    code = Math.random().toString(36).slice(2,7).toUpperCase()
    localStorage.setItem('game:code', code)
  }
  return code
}

function getPlayerId(){
  let id = localStorage.getItem('player:id')
  if(!id){ id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)); localStorage.setItem('player:id', id) }
  return id
}

export async function upsertPlayer(payload){
  if(!rtEnabled) return
  const game_code = getGameCode()
  const player_id = getPlayerId()
  const row = { game_code, player_id, ...payload }
  await supabase.from('players').upsert(row, { onConflict: 'game_code,player_id' })
}

export function subscribePlayers(onData){
  if(!rtEnabled) return () => {}
  const game_code = getGameCode()
  const channel = supabase.channel('players-'+game_code)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter:`game_code=eq.${game_code}` }, async () => {
      const { data } = await supabase.from('players').select('*').eq('game_code', game_code).order('created_at')
      onData(data || [])
    })
    .subscribe(async status => {
      if(status === 'SUBSCRIBED'){
        const { data } = await supabase.from('players').select('*').eq('game_code', game_code).order('created_at')
        onData(data || [])
      }
    })
  return () => { supabase.removeChannel(channel) }
}
