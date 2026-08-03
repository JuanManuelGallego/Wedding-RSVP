import { NextResponse } from 'next/server';
import { isAuthed } from '../adminAuth';

export function requireAuth(): NextResponse | null {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  return null;
}
