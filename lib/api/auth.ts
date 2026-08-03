import { NextResponse } from 'next/server';
import { isAuthed } from '../adminAuth';

export async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  return null;
}
