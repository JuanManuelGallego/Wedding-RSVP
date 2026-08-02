import { NextResponse } from 'next/server';
import { LOCALES } from '../../../lib/i18n';

export const runtime = 'nodejs';

export async function POST(request) {
  const { locale } = await request.json();

  const res = NextResponse.json({ ok: true });

  if (LOCALES.includes(locale)) {
    res.cookies.set('lang', locale, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return res;
}
