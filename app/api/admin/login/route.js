import { NextResponse } from 'next/server';
import { expectedToken, COOKIE_NAME } from '../../../../lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not set in the environment.' },
      { status: 500 }
    );
  }

  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
