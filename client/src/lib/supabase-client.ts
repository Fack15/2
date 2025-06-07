import { createClient } from '@supabase/supabase-js'

// This will be configured when environment variables are available
let supabaseClient: any = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    // Try to get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      // Return a mock client that will throw informative errors
      supabaseClient = {
        auth: {
          signUp: () => Promise.reject(new Error('Supabase credentials not configured')),
          signInWithPassword: () => Promise.reject(new Error('Supabase credentials not configured')),
          signOut: () => Promise.reject(new Error('Supabase credentials not configured')),
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: null } })
        }
      };
    }
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();
export type { User, Session } from '@supabase/supabase-js'