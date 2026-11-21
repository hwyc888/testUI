import { json, readJson, sameOrigin, createSession, sessionCookie, newId, publicUser } from "../../_lib/auth.js";
import { createPasswordVerifier, validPasswordMaterial } from "../../_lib/password.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  if (!env.APP_PASSWORD_PEPPER) return json({ error: "密码验证服务尚未配置" }, 503);
  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const fullName = String(body.full_name || "").trim();
  const phone = String(body.phone || "").trim();
  const passwordKey = String(body.password_key || "");
  const passwordSalt = String(body.password_salt || "");
  if (!fullName || fullName.length > 30) return json({ error: "请填写真实姓名" }, 400);
  if (!/^1[3-9]\d{9}$/.test(phone)) return json({ error: "请输入有效的中国大陆手机号" }, 400);
  if (!validPasswordMaterial(passwordKey, passwordSalt)) return json({ error: "密码验证数据无效，请重新输入密码后注册" }, 400);

  const id = newId("usr");
  const now = new Date().toISOString();
  try {
    const passwordHash = await createPasswordVerifier(passwordKey, passwordSalt, env);
    await env.DB.prepare(
      "INSERT INTO users (id, username, password_hash, password_salt, role, full_name, phone, created_at) VALUES (?, ?, ?, ?, 'student', ?, ?, ?)"
    ).bind(id, phone, passwordHash, passwordSalt, fullName, phone, now).run();
    const user = { id, username: phone, role: "student", full_name: fullName };
    const token = await createSession(user, env);
    return json({ ok: true, user: publicUser(user) }, 201, { "Set-Cookie": sessionCookie(token) });
  } catch (error) {
    if (String(error).includes("UNIQUE")) return json({ error: "该手机号已经注册，请直接登录" }, 409);
    throw error;
  }
}
