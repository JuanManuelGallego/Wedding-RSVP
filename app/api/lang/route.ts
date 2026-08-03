import { langSchema } from '@/lib/validations';
import { jsonSuccess } from '@/lib/api/responses';
import type { Locale } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return jsonSuccess({ ok: true });

  const parsed = langSchema.safeParse(body);
  if (!parsed.success) return jsonSuccess({ ok: true });

  const res = jsonSuccess({ ok: true });
  res.cookies.set('lang', parsed.data.locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return res;
}
