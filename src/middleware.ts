import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: This middleware is minimal because we use localStorage for auth tokens
// which cannot be accessed from Next.js middleware (server-side).
// Auth checks are handled on the client-side in each component.

export function middleware(request: NextRequest) {
  // Just pass through - auth is handled client-side
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

