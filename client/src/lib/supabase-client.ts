import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhzzwpdojwnmgvycaeqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhoenp3cGRvandubWd2eWNhZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzcwMDQsImV4cCI6MjA2NDgxMzAwNH0.Td4uFuJ31qEmIy9cVx7Aahk3ZWj19qTAhbOaz7XiWqE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { User, Session } from '@supabase/supabase-js'