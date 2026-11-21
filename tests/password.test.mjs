import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto;

const { createPasswordVerifier, verifyPasswordMaterial, validPasswordMaterial, fakePasswordSalt } =
  await import("../functions/_lib/password.js");

function base64url(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

async function derive(password, saltText) {
  const salt = Buffer.from(saltText, "base64url");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" },
    key,
    256
  );
  return base64url(new Uint8Array(bits));
}

const env = { APP_PASSWORD_PEPPER: "test-only-pepper-secret-that-is-not-used-in-production" };

test("password proof verifies only with the matching password and salt", async () => {
  const salt = base64url(crypto.getRandomValues(new Uint8Array(16)));
  const proof = await derive("Correct-Horse-Battery-42!", salt);
  const stored = await createPasswordVerifier(proof, salt, env);

  assert.equal(await verifyPasswordMaterial(proof, salt, salt, stored, env), true);
  assert.equal(await verifyPasswordMaterial(await derive("wrong-password", salt), salt, salt, stored, env), false);
  assert.equal(await verifyPasswordMaterial(proof, base64url(crypto.getRandomValues(new Uint8Array(16))), salt, stored, env), false);
});

test("password salts are validated and login challenges do not reveal account existence by stability", async () => {
  const salt = base64url(crypto.getRandomValues(new Uint8Array(16)));
  const proof = await derive("A-secure-password-123", salt);
  assert.equal(validPasswordMaterial(proof, salt), true);
  assert.equal(validPasswordMaterial("bad", salt), false);

  const fakeOne = await fakePasswordSalt("student@example.test", "student", env);
  const fakeTwo = await fakePasswordSalt("student@example.test", "student", env);
  const otherUser = await fakePasswordSalt("other@example.test", "student", env);
  assert.equal(fakeOne, fakeTwo);
  assert.notEqual(fakeOne, otherUser);
});
