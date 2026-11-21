import { json, readJson, sameOrigin, verifyPassword, createSession, sessionCookie, publicUser } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = body.role === "student" ? "student" : "admin";
  if (!username || !password || password.length > 128) return json({ error: "请输入账号和密码" }, 400);

  const user = await env.DB.prepare(
    "SELECT id, username, password_hash, role, full_name FROM users WHERE username = ? AND role = ?"
  ).bind(username, role).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ error: "账号或密码不正确" }, 401);
  }

  const token = await createSession(user, env);
  return json({ ok: true, user: publicUser(user) }, 200, { "Set-Cookie": sessionCookie(token) });
}
