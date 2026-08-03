-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

-- Single table: each guest row is also their RSVP. A guest "has responded"
-- when attending is not null; responded_at holds the last time they answered.
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  slug text unique not null,        -- unique per-guest link (/<slug>)
  display_name text not null,
  party_size int not null default 1, -- set by admin; the guest can't change this
  whatsapp text,                     -- admin-only: number to send the link to
  invite_sent boolean not null default false, -- admin-only: link sent to guest?
  lang text not null default 'es',      -- admin-only: guest's invite language (es|fr)
  attending boolean,                 -- null = hasn't responded yet
  responded_at timestamp with time zone,
  viewed_at timestamp with time zone  -- when the guest first opened their link
);

-- For installs that created the table before invite_sent existed.
alter table guests add column if not exists invite_sent boolean not null default false;

-- For installs that created the table before lang existed.
alter table guests add column if not exists lang text not null default 'es';

-- For installs that created the table before viewed_at existed.
alter table guests add column if not exists viewed_at timestamp with time zone;

-- Lock the table down by default. Guest lookups and admin reads happen only
-- through the server using the service role key, which bypasses RLS.
alter table guests enable row level security;

-- New Supabase projects grant anon/authenticated full access to new tables by
-- default. Strip all of that; the browser (anon key) only needs the two RSVP
-- columns below. Everything else — name, party size, WhatsApp number, slug —
-- stays visible to the service role key only.
revoke all on guests from anon, authenticated;

-- The RSVP form reads the guest's current answer to prefill it and uses the
-- id in its WHERE clause, so anon needs read access to exactly these columns.
grant select (id, attending, responded_at) on guests to anon;

-- And anon can only ever SET those two RSVP fields. The column-level grant
-- means a guest cannot overwrite party_size, whatsapp, display_name, or slug
-- even though the policies below allow updates to the row.
grant update (attending, responded_at) on guests to anon;

-- The public site (from the browser, with the publishable key) can view and
-- update a guest's RSVP fields. There's no guest login, so this trusts whoever
-- holds a guest's link — the same trust model as the link itself.
--
-- Note: Postgres requires a row to be readable under a SELECT policy before
-- and after an UPDATE, so the SELECT policy must exist alongside the UPDATE
-- policy. The column grants above are what actually cap what anon can touch.
create policy "Guests can view their RSVP fields"
  on guests for select
  to anon
  using (true);

create policy "Anyone holding a guest link can update the RSVP"
  on guests for update
  to anon
  using (true)
  with check (true);
