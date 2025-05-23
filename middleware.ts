import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  const pathname = nextUrl.pathname;

  const protectedRoutes = ['/dashboard', '/admin'];
  const isOnProtectedRoute = protectedRoutes.some(path => pathname.startsWith(path));
  const isOnAuthRoute = pathname.startsWith('/auth');

  // Redirect unauthenticated users from protected routes
  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users away from auth routes
  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard/profile', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
