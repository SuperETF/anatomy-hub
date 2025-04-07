// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hszgtzsgvurzjiffiitt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzemd0enNndnVyemppZmZpaXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDIxMTIsImV4cCI6MjA1OTMxODExMn0.Y4HRU5Xo6K2t16WhJ5I4OSLfHN49jtTHaQ4rzH1QejM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
