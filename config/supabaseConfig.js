import { createClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Normalizar removendo barras finais duplicadas
if (supabaseUrl) {
	supabaseUrl = supabaseUrl.replace(/\/+$/, '')
}
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
	console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL não configurada corretamente.')
}
if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
	console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada corretamente.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name
export const STORAGE_BUCKET = 'room-images'
export const SUPABASE_URL = supabaseUrl
