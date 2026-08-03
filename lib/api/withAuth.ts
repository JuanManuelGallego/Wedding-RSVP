import { NextResponse } from 'next/server';
import { isAuthed } from '../adminAuth';

const CSRF_HEADER = 'x-requested-with';

export function requireCsrf(request: Request): NextResponse | null {
  if (request.headers.get(CSRF_HEADER) !== 'XMLHttpRequest') {
    return NextResponse.json({ error: 'Missing CSRF header' }, { status: 403 });
  }
  return null;
}

type RouteHandler = (
  request: Request,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    const csrfError = requireCsrf(request);
    if (csrfError) return csrfError;

    if (!(await isAuthed())) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    return handler(request, context);
  };
}
