import { createClient } from '@supabase/supabase-js';

// Use environment variables or dummy keys if undefined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fake-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fake-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
