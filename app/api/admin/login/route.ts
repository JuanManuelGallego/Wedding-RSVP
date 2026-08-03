import { loginSchema } from '@/lib/validations';
import { createToken, COOKIE_NAME } from '@/lib/adminAuth';
import { jsonError, jsonSuccess } from '@/lib/api/responses';
import { requireCsrf } from '@/lib/api/withAuth';

export const runtime = 'nodejs';

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) return true;

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  const csrfError = requireCsrf(request);
  if (csrfError) return csrfError;

  if (!process.env.ADMIN_PASSWORD) {
    return jsonError('ADMIN_PASSWORD is not set in the environment.', 500);
  }

  const key = getRateLimitKey(request);
  if (isRateLimited(key)) {
    return jsonError('Too many login attempts. Please try again later.', 429);
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
  res.cookies.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
