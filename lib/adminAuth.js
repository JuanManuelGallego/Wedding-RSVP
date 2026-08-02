import { cookies } from 'next/headers';
import crypto from 'crypto';

// One shared password for the admin page (set as ADMIN_PASSWORD).
// This is intentionally simple: no per-guest login, no user accounts —
// just a single gate for whoever is managing the guest list.
export const COOKIE_NAME = 'wedding_admin';

export function expectedToken() {
  const secret = process.env.ADMIN_PASSWORD || '';
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return Boolean(token) && Boolean(process.env.ADMIN_PASSWORD) && token === expectedToken();
}
