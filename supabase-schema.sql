-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

-- Single table: each guest row is also their RSVP. A guest "has responded"
-- when attending is not null; responded_at holds the last time they answered.
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  slug text unique not null,        -- unique per-guest link (/rsvp/<slug>)
  display_name text not null,
  party_size int not null default 1, -- set by admin; the guest can't change this
  whatsapp text,                     -- admin-only: number to send the link to
  attending boolean,                 -- null = hasn't responded yet
  responded_at timestamp with time zone
);

-- Lock the table down by default. Guest lookups and admin reads happen only
-- through the server using the service role key, which bypasses RLS.
alter table guests enable row level security;

-- The public site (from the browser, with the anon key) can update a guest's
-- RSVP fields. There's no guest login, so this trusts whoever holds a
-- guest's link — the same trust model as the link itself.
create policy "Anyone can update an RSVP"
  on guests for update
  to anon
  using (true)
  with check (true);
