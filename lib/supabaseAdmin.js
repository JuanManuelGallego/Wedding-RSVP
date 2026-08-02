import { createClient } from '@supabase/supabase-js';

// IMPORTANT: this file must never be imported into a client component.
// It uses the service role key, which bypasses Row Level Security, so it
// can read/write everything in the database. Only use it from Server
// Components and Route Handlers.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.'
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
