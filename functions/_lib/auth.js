const SESSION_COOKIE = "admission_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function json(data, status = 200, extraHeaders = {}) {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "same-origin");
  return new Response(JSON.stringify(data), { status, headers });
}

export function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function getCookie(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp("(?:^|;\\s*)" + SESSION_COOKIE + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function hashKey(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value)));
  return base64url(new Uint8Array(digest));
}

async function digestToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return base64url(new Uint8Array(digest));
}

export async function createSession(user, env) {
  const token = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await digestToken(token);
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  ).bind(tokenHash, user.id, expires.toISOString(), now.toISOString()).run();
  return token;
}

export function sessionCookie(token) {
  return SESSION_COOKIE + "=" + encodeURIComponent(token) +
    "; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=" + SESSION_TTL_SECONDS;
}

export function clearSessionCookie() {
  return SESSION_COOKIE + "=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}

export async function currentUser(request, env) {
  const token = getCookie(request);
  if (!token) return null;
  const tokenHash = await digestToken(token);
  return await env.DB.prepare(
    "SELECT u.id, u.username, u.role, u.full_name, u.phone FROM sessions s " +
    "JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?"
  ).bind(tokenHash, new Date().toISOString()).first();
}

export function publicUser(user) {
  return { id: user.id, username: user.username, role: user.role, full_name: user.full_name };
}

export function newId(prefix) {
  return prefix + "_" + base64url(crypto.getRandomValues(new Uint8Array(18)));
}

export async function secureCompare(left, right) {
  const a = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(left)));
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(right)));
  const aa = new Uint8Array(a);
  const bb = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < aa.length; i += 1) diff |= aa[i] ^ bb[i];
  return diff === 0;
}
