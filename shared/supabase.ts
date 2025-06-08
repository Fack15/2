import { createClient } from '@supabase/supabase-js'

// Get environment variables - will be populated once credentials are provided
const supabaseUrl = (typeof window !== 'undefined' 
  ? (window as any).__SUPABASE_URL__ 
  : process.env.SUPABASE_URL) || 'https://placeholder.supabase.co'

const supabaseAnonKey = (typeof window !== 'undefined'
  ? (window as any).__SUPABASE_ANON_KEY__
  : process.env.SUPABASE_ANON_KEY) || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { User, Session } from '@supabase/supabase-js'