// Stateless signed-cookie session helper.
// Uses Web Crypto (available in both the Node.js runtime and the Edge
// middleware runtime) so the same code verifies the admin session cookie
// everywhere, without touching the database from inside middleware.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createToken(payload, secret, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const body = { ...payload, exp: Date.now() + maxAgeSeconds * 1000 };
  const bodyB64 = bytesToBase64url(encoder.encode(JSON.stringify(body)));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyB64));
  const sigB64 = bytesToBase64url(new Uint8Array(sig));
  return `${bodyB64}.${sigB64}`;
}

export async function verifyToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [bodyB64, sigB64] = token.split('.');
  if (!bodyB64 || !sigB64) return null;
  try {
    const key = await getKey(secret);
    const sig = base64urlToBytes(sigB64);
    const valid = await crypto.subtle.verify('HMAC', key, sig, encoder.encode(bodyB64));
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(base64urlToBytes(bodyB64)));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'khaleeva_admin_session';
