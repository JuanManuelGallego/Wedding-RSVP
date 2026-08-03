import { loginSchema } from '@/lib/validations';
import { expectedToken, COOKIE_NAME } from '@/lib/adminAuth';
import { jsonError, jsonSuccess } from '@/lib/api/responses';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return jsonError('ADMIN_PASSWORD is not set in the environment.', 500);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError('Invalid JSON', 400);

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0].message, 400);
  }

  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return jsonError('Incorrect password', 401);
  }

  const res = jsonSuccess({ ok: true });
  res.cookies.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
