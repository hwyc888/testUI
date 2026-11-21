import { json, readJson, sameOrigin, currentUser, createSession, sessionCookie } from "../../_lib/auth.js";
import { createPasswordVerifier, verifyPasswordMaterial, validPasswordMaterial } from "../../_lib/password.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const user = await currentUser(request, env);
  if (!user) return json({ error: "登录状态已失效，请重新登录" }, 401);
  if (!env.APP_PASSWORD_PEPPER) return json({ error: "密码验证服务尚未配置" }, 503);

  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const oldPasswordKey = String(body.old_password_key || "");
  const oldPasswordSalt = String(body.old_password_salt || "");
  const newPasswordKey = String(body.new_password_key || "");
  const newPasswordSalt = String(body.new_password_salt || "");
  if (!validPasswordMaterial(newPasswordKey, newPasswordSalt)) return json({ error: "新密码验证数据无效" }, 400);

  const row = await env.DB.prepare("SELECT password_hash, password_salt FROM users WHERE id = ?").bind(user.id).first();
  const verified = row && await verifyPasswordMaterial(
    oldPasswordKey,
    oldPasswordSalt,
    row.password_salt,
    row.password_hash,
    env
  );
  if (!verified) return json({ error: "当前密码不正确" }, 400);

  const passwordHash = await createPasswordVerifier(newPasswordKey, newPasswordSalt, env);
  await env.DB.prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?")
    .bind(passwordHash, newPasswordSalt, user.id).run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
  const token = await createSession(user, env);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}
