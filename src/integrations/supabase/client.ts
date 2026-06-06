import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yerldoyzqgiaxkxyugap.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZRBkRYswOL3khohhpoUKAw_PNklkbeN";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
