import { NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from './lib/session';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const payload = await verifyToken(token, process.env.SESSION_SECRET || 'dev-secret-ganti-ini');
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
