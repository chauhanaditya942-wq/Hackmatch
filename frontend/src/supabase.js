import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hyujzsuyjvcthbhogqqc.supabase.co"
const supabaseKey = "sb_publishable_hRXTjIQjyuoUhNkuv1-tNA_GWof7VRQ"

export const supabase = createClient(supabaseUrl, supabaseKey)
