import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase variables missing');
  }
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.warn("⚠️ Credenciais do Supabase ausentes. VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam ser configurados nos 'Secrets' para o login funcionar.");
  supabaseClient = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => { throw new Error("Configuração do Supabase ausente. Configure as variáveis de ambiente."); },
      signUp: async () => { throw new Error("Configuração do Supabase ausente."); },
      signInWithOAuth: async () => { throw new Error("Configuração do Supabase ausente."); },
      signOut: async () => {}
    }
  };
}

export const supabase = supabaseClient;
