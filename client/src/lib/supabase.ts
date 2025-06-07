import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from the server endpoint
let supabaseUrl = ''
let supabaseAnonKey = ''

// Fetch config from server
fetch('/api/config')
  .then(res => res.json())
  .then(config => {
    supabaseUrl = config.supabaseUrl
    supabaseAnonKey = config.supabaseAnonKey
  })
  .catch(() => {
    // Fallback for development
    supabaseUrl = 'placeholder'
    supabaseAnonKey = 'placeholder'
  })

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)

export type { User } from '@supabase/supabase-js'