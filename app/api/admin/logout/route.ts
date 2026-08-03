import { COOKIE_NAME } from '@/lib/adminAuth';
import { jsonSuccess } from '@/lib/api/responses';
import { requireCsrf } from '@/lib/api/withAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const csrfError = requireCsrf(request);
  if (csrfError) return csrfError;

  const res = jsonSuccess({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}
