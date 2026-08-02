-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- If you already ran the old version of this file, see the MIGRATION block
-- at the bottom instead of running this whole script again.

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  slug text unique not null,
  display_name text not null,
  party_size int not null default 1 -- set by admin; the guest can't change this
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  guest_id uuid not null unique references guests(id) on delete cascade,
  attending boolean not null,
  party_size int not null default 1,
  email text
);

-- Lock both tables down by default. The app never queries these with the
-- public anon key for reads — guest lookups and admin reads happen only
-- through the server, using the service role key, which bypasses RLS.
alter table guests enable row level security;
alter table rsvps enable row level security;

-- The public site (from the browser, with the anon key) can insert a new
-- RSVP, and can update it later if the guest changes their response. There's
-- no guest login, so this trusts whoever holds a guest's link — the same
-- trust model as the link itself.
create policy "Anyone can submit an RSVP"
  on rsvps for insert
  to anon
  with check (true);

create policy "Anyone can update an RSVP"
  on rsvps for update
  to anon
  using (true)
  with check (true);

-- ============================================================
-- MIGRATION: run this instead if you already created the tables
-- with the old schema (max_party_size, no unique guest_id).
-- ============================================================
-- alter table guests rename column max_party_size to party_size;
-- alter table rsvps add constraint rsvps_guest_id_key unique (guest_id);
-- create policy "Anyone can update an RSVP"
--   on rsvps for update
--   to anon
--   using (true)
--   with check (true);
