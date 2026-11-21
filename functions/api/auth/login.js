import { json, readJson, sameOrigin, createSession, sessionCookie, publicUser, hashKey } from "../../_lib/auth.js";
import { verifyPasswordMaterial, validPasswordMaterial } from "../../_lib/password.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const username = String(body.username || "").trim().toLowerCase();
  const passwordKey = String(body.password_key || "");
  const passwordSalt = String(body.password_salt || "");
  const role = body.role === "student" ? "student" : "admin";
  if (!username || !validPasswordMaterial(passwordKey, passwordSalt)) {
    return json({ error: "账号或密码不正确" }, 401);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const attemptKey = await hashKey(username + "|" + ip);
  const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const attempts = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM login_attempts WHERE attempt_key = ? AND attempted_at > ?"
  ).bind(attemptKey, windowStart).first();
  if (Number(attempts?.count || 0) >= 8) return json({ error: "尝试次数过多，请 15 分钟后再试" }, 429);

  const user = await env.DB.prepare(
    "SELECT id, username, password_hash, password_salt, role, full_name FROM users WHERE username = ? AND role = ?"
  ).bind(username, role).first();
  const verified = user && await verifyPasswordMaterial(
    passwordKey,
    passwordSalt,
    user.password_salt,
    user.password_hash,
    env
  );
  if (!verified) {
    await env.DB.prepare("INSERT INTO login_attempts (attempt_key, attempted_at) VALUES (?, ?)").bind(attemptKey, new Date().toISOString()).run();
    return json({ error: "账号或密码不正确" }, 401);
  }

  await env.DB.prepare("DELETE FROM login_attempts WHERE attempt_key = ?").bind(attemptKey).run();
  await env.DB.prepare("DELETE FROM login_attempts WHERE attempted_at < ?").bind(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).run();
  const token = await createSession(user, env);
  return json({ ok: true, user: publicUser(user) }, 200, { "Set-Cookie": sessionCookie(token) });
}
