import { cookies } from 'next/headers';
import crypto from 'crypto';

export const COOKIE_NAME = 'wedding_admin';

export function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || '';
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(token) && Boolean(process.env.ADMIN_PASSWORD) && token === expectedToken();
}
