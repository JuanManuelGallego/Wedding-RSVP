import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// During local dev without env vars set, this will throw a clear error
// rather than failing silently deep in a fetch call.
if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase env vars are missing. Copy .env.local.example to .env.local and fill in your project values.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
