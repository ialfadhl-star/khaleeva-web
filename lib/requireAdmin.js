import { verifyToken, SESSION_COOKIE } from './session';

export async function requireAdmin(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken(token, process.env.SESSION_SECRET || 'dev-secret-ganti-ini');
  return payload;
}
