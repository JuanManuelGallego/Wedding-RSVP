import { NextResponse } from 'next/server';

export function jsonSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
