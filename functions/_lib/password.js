const PASSWORD_KEY_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64url(value) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}

export function validPasswordMaterial(passwordKey, passwordSalt) {
  const key = decodeBase64url(passwordKey);
  const salt = decodeBase64url(passwordSalt);
  return Boolean(key && salt && key.length === PASSWORD_KEY_BYTES && salt.length === PASSWORD_SALT_BYTES);
}

async function hmac(value, env) {
  if (!env.APP_PASSWORD_PEPPER) throw new Error("APP_PASSWORD_PEPPER is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.APP_PASSWORD_PEPPER),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return new Uint8Array(signature);
}

export async function createPasswordVerifier(passwordKey, passwordSalt, env) {
  if (!validPasswordMaterial(passwordKey, passwordSalt)) {
    throw new Error("Invalid password proof or salt");
  }
  const signature = await hmac("admission-password-v1:" + passwordSalt + ":" + passwordKey, env);
  return "hmac-sha256$1$" + base64url(signature);
}

export async function verifyPasswordMaterial(passwordKey, suppliedSalt, storedSalt, storedHash, env) {
  if (!validPasswordMaterial(passwordKey, suppliedSalt) || suppliedSalt !== storedSalt) return false;
  if (typeof storedHash !== "string" || !storedHash.startsWith("hmac-sha256$1$")) return false;
  const expected = await createPasswordVerifier(passwordKey, suppliedSalt, env);
  const left = new TextEncoder().encode(expected);
  const right = new TextEncoder().encode(storedHash);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function fakePasswordSalt(username, role, env) {
  const signature = await hmac("admission-login-challenge-v1:" + role + ":" + username, env);
  return base64url(signature.slice(0, PASSWORD_SALT_BYTES));
}

export function randomPasswordSalt() {
  return base64url(crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES)));
}
