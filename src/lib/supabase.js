import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bkowndltrknbkrbyfvnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb3duZGx0cmtuYmtyYnlmdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzk3MjIsImV4cCI6MjA5NjU1NTcyMn0.eDfbZqKQgEKkU4pJZirhlWRMeykGoIEZFzxuMW1cO0Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
