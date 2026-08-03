import { cookies } from 'next/headers';

export const COOKIE_NAME = 'wedding_admin';

export async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(token) && Boolean(process.env.ADMIN_PASSWORD) && token === process.env.ADMIN_PASSWORD;
}

export function createToken(): string {
  return process.env.ADMIN_PASSWORD ?? '';
}
