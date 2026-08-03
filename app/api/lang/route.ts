import { NextResponse } from 'next/server';
import { LOCALES } from '../../../lib/i18n';
import type { Locale } from '../../../lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { locale } = (await request.json()) as { locale: string };

  const res = NextResponse.json({ ok: true });

  if (LOCALES.includes(locale as Locale)) {
    res.cookies.set('lang', locale, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return res;
}
