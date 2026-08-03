import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase env vars are missing. Copy .env.local.example to .env.local and fill in your project values.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl ?? '',
  supabasePublishableKey ?? ''
);
