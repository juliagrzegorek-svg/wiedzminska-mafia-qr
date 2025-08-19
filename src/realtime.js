// Realtime możesz kiedyś podpiąć do Supabase. Na razie — lokalny „no-op”.
export const rtEnabled = false;

export function getGameCode() {
  const k = 'game:code';
  let code = localStorage.getItem(k);
  if (!code) {
    code = Math.random().toString(36).slice(2, 7).toUpperCase();
    localStorage.setItem(k, code);
  }
  return code;
}

export async function upsertPlayer(_row) { /* no-op w trybie lokalnym */ }
export function subscribePlayers(set) {
  set([]); // brak realtime — pusta lista
  return () => {};
}
