import { json, readJson, sameOrigin, currentUser, verifyPassword, hashPassword, createSession, sessionCookie } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const user = await currentUser(request, env);
  if (!user) return json({ error: "登录状态已失效，请重新登录" }, 401);
  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const oldPassword = String(body.old_password || "");
  const newPassword = String(body.new_password || "");
  if (!newPassword || newPassword.length < 8 || newPassword.length > 128) return json({ error: "新密码至少 8 位，最多 128 位" }, 400);
  const row = await env.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(user.id).first();
  if (!row || !(await verifyPassword(oldPassword, row.password_hash))) return json({ error: "当前密码不正确" }, 400);
  const passwordHash = await hashPassword(newPassword);
  await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, user.id).run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
  const token = await createSession(user, env);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}
