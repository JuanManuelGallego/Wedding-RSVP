import { COOKIE_NAME } from '@/lib/adminAuth';
import { jsonSuccess } from '@/lib/api/responses';

export const runtime = 'nodejs';

export async function POST() {
  const res = jsonSuccess({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}
