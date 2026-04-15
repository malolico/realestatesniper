// NO CAMBIES NADA.
// NO OPTIMICES.
// NO AÑADAS NADA.
// NO INTERPRETES.
// SOLO EJECUTA EXACTAMENTE LO QUE TE DOY.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)