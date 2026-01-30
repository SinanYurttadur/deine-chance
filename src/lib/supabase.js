import { createClient } from '@supabase/supabase-js';

// Diese Werte findest du in deinem Supabase Dashboard unter:
// Settings > API > Project URL und anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase Konfiguration fehlt! Bitte erstelle eine .env Datei mit:\n' +
    'VITE_SUPABASE_URL=deine-projekt-url\n' +
    'VITE_SUPABASE_ANON_KEY=dein-anon-key'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
