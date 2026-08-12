import { NextResponse } from 'next/server';
import { createToken, SESSION_COOKIE } from '../../../../lib/session';

export async function POST(request) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'khaleeva2026';

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
  }

  const token = await createToken(
    { u: username },
    process.env.SESSION_SECRET || 'dev-secret-ganti-ini'
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
