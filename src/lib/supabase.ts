import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && publishableKey)

// createBrowserClient guarda la sesión en cookies. Solo se utiliza la clave
// pública; RLS protege todos los datos accesibles desde este cliente.
export const supabase = isSupabaseConfigured
  ? createBrowserClient<Database>(url, publishableKey)
  : null
