# Wedding RSVP — Manuela & Juan Manuel

A bilingual (Español / Français) wedding invite site with unique per-guest RSVP
links and a password-protected admin page to manage guests and see responses.
No guest accounts or logins — each guest just gets a private link that plays a
full-screen invitation video, then asks for their RSVP.

- Wedding: Sunday, June 6, 2027 · 4:00 PM — Yerbabuena, La Ceja (reception to follow)
- RSVP deadline: September 1, 2026

## How it works

- `/` — the public info page (hero, the day, our story, gallery)
- `/[slug]` — a guest's personal invitation: a full-screen video (replace
  `public/video.mp4`) that fades into big Yes/No RSVP buttons. Party size is
  fixed by the admin, not chosen by the guest. If they've already responded,
  they can change their answer any time. Append `?lang=fr` to the link to
  open it in French (Spanish is the default).
- `/admin` — gated by a single shared password (`ADMIN_PASSWORD`). From here
  you add guests one at a time or via CSV import, see all responses, and
  export a CSV. Each guest row also stores a **WhatsApp number** (admin-only,
  never shown to guests) so you know which number to send each link to.

## Language toggle

Guest-facing pages are available in Spanish (default) and French via the
`ES`/`FR` toggle in the top-right corner. The choice is stored in a cookie for
one year. The admin panel stays in English.

## 1. Set up Supabase (free)

1. Create a project at https://supabase.com
2. Go to **SQL Editor → New query**, paste the contents of `supabase-schema.sql`, and run it.
   This creates the single `guests` table — each row holds the guest details
   and their RSVP (`attending`, `responded_at`). The schema also locks the
   table down: browsers can only read/write the RSVP fields (`id`,
   `attending`, `responded_at`); guest names, party sizes, and WhatsApp
   numbers are only reachable server-side with the service role key.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **publishable** key (for the browser — if your project only shows an
     `anon` key, copy that instead and use `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (keep this one secret — it has full database access)

## 2. Configure the app

1. Copy `.env.local.example` to `.env.local`
2. Fill in all five values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=…
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=…
   NEXT_PUBLIC_SITE_URL=…          # your deployed URL, used to print guest links
   SUPABASE_SERVICE_ROLE_KEY=…     # server-only, used by /admin and /[slug]
   ADMIN_PASSWORD=…                # whatever password you'll use to log into /admin
   ```

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000, and http://localhost:3000/admin to add your first guest.

## 4. Personalize

- Couple names: `lib/site.ts`
- All translated text (dates, venue, story, labels, deadline): `lib/i18n.ts` —
  the Our Story body is Lorem Ipsum, replace `storyHowWeMetBody` /
  `storyProposalBody` in both languages when ready.
- Photos: drop JPEGs into `public/` as `photo-01.jpg` … `photo-12.jpg`
  (update `PHOTO_COUNT` in `app/components/home/GallerySection.tsx` if you change
  the number of photos).
- Colors, fonts: `app/globals.css` (CSS variables at the top)

## 5. Deploy

1. Push this folder to a new GitHub repo (a `.gitignore` is already set up to exclude
   `node_modules` and `.env.local`)
2. Go to https://vercel.com, import the repo
3. Add all five environment variables from step 2 in Vercel's project settings
4. Deploy

## 6. Add guests and send links

**One at a time:** go to `/admin`, log in, and under **Add a guest** enter
each guest or family name, their exact party size, and their WhatsApp number
— this creates a link like `yoursite.com/the-alvarez-family-x7k2`.

**In bulk:** under **Import guests from CSV**, upload a file with up to three columns:

```
name,party_size,whatsapp
The Alvarez Family,3,+57 300 123 4567
Sam Chen,1,
Priya & Raj Patel,2,+57 301 765 4321
```

A header row is optional — if the first row's first cell reads "name" or
"guest" it's skipped automatically. Rows missing a name, or with an invalid
party size, are skipped and reported after import. The whatsapp column is
optional.

Either way, the Guest links table shows each guest's WhatsApp number next to
their link — message each guest their personal link there. Watch responses
come in under **Responses**, and use **Export CSV** whenever you need a
spreadsheet for the caterer or venue. Guests can revisit their own link any
time to see or change their answer.

## Security notes

- The `service_role` key has full access to your database — it's only ever used
  server-side (in `/admin` and `/[slug]`), never sent to the browser.
- The admin gate is a single shared password, not per-user accounts — fine for a
  couple managing their own guest list, not meant for anything higher-stakes.
- Guest links act as the "password" for each guest's RSVP — anyone with the link
  can RSVP as that guest (and, in theory, edit that guest row's admin fields),
  so keep links to trusted invitations only.
