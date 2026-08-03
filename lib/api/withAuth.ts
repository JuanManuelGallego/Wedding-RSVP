import { NextResponse } from 'next/server';
import { isAuthed } from '../adminAuth';

type RouteHandler = (
  request: Request,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    if (!(await isAuthed())) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    return handler(request, context);
  };
}
