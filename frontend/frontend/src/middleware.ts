import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add the pathname as a header for the root layout to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// This will invoke middleware for all routes
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};