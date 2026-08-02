# Wedding RSVP

A wedding invite site with unique per-guest RSVP links and a password-protected
admin page to manage guests and see responses. No guest accounts or logins —
each guest just gets a private link.

Placeholder names, date, and venue are in `app/page.js` and `app/rsvp/[slug]/page.js` —
replace with your own details.

## How it works

- `/` — the public info page (no RSVP form here)
- `/rsvp/[slug]` — a guest's personal invite + RSVP form, pre-filled with their
  name. Party size is fixed by the admin, not chosen by the guest. If they've
  already responded, they see their answer and can change it any time.
- `/admin` — gated by a single shared password (`ADMIN_PASSWORD`). From here you
  add guests one at a time or via CSV import, see all responses, and export a CSV.

## 1. Set up Supabase (free)

1. Create a project at https://supabase.com
2. Go to **SQL Editor → New query**, paste the contents of `supabase-schema.sql`, and run it.
   This creates the `guests` and `rsvps` tables.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this one secret — it has full database access)

## 2. Configure the app

1. Copy `.env.local.example` to `.env.local`
2. Fill in all five values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=...          # your deployed URL, used to print guest links
   SUPABASE_SERVICE_ROLE_KEY=...     # server-only, used by /admin and /rsvp/[slug]
   ADMIN_PASSWORD=...                # whatever password you'll use to log into /admin
   ```

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000, and http://localhost:3000/admin to add your first guest.

## 4. Personalize

- Names, date, venue: `app/page.js` and `app/rsvp/[slug]/page.js`
- Colors, fonts: `app/globals.css` (CSS variables at the top)
- RSVP deadline text: bottom of `app/components/RSVPForm.js`

## 5. Deploy

1. Push this folder to a new GitHub repo (a `.gitignore` is already set up to exclude
   `node_modules` and `.env.local`)
2. Go to https://vercel.com, import the repo
3. Add all five environment variables from step 2 in Vercel's project settings
4. Deploy

## 6. Add guests and send links

**One at a time:** go to `/admin`, log in, and under **Add a guest** enter
each guest or family name and their exact party size — this creates a link
like `yoursite.com/rsvp/the-alvarez-family-x7k2`.

**In bulk:** under **Import guests from CSV**, upload a file with two columns:

```
name,party_size
The Alvarez Family,3
Sam Chen,1
Priya & Raj Patel,2
```

A header row is optional — if the first row's first cell reads "name" or
"guest" it's skipped automatically. Rows missing a name, or with an invalid
party size, are skipped and reported after import.

Either way, copy each guest's link into their invitation (paper insert, text,
or email). Watch responses come in under **Responses**, and use **Export CSV**
whenever you need a spreadsheet for the caterer or venue. Guests can revisit
their own link any time to see or change their answer.

## Security notes

- The `service_role` key has full access to your database — it's only ever used
  server-side (in `/admin` and `/rsvp/[slug]`), never sent to the browser.
- The admin gate is a single shared password, not per-user accounts — fine for a
  couple managing their own guest list, not meant for anything higher-stakes.
- Guest links act as the "password" for each guest's RSVP — anyone with the link
  can RSVP as that guest, so keep links to trusted invitations only.
