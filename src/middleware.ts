import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes = ['/dashboard'];
// If authorized user will hit public route, he will be redirected to /dashboard
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
  const headers = new Headers(req.headers);
  headers.set('x-current-path', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
