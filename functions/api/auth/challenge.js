import { json, sameOrigin } from "../../_lib/auth.js";
import { fakePasswordSalt } from "../../_lib/password.js";

export async function onRequestGet({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const url = new URL(request.url);
  const username = String(url.searchParams.get("username") || "").trim().toLowerCase();
  const role = url.searchParams.get("role") === "student" ? "student" : "admin";
  if (!username || username.length > 64) return json({ error: "请输入账号" }, 400);
  if (!env.APP_PASSWORD_PEPPER) return json({ error: "密码验证服务尚未配置" }, 503);

  const user = await env.DB.prepare(
    "SELECT password_salt FROM users WHERE username = ? AND role = ?"
  ).bind(username, role).first();

  const salt = user?.password_salt || await fakePasswordSalt(username, role, env);
  return json({ salt });
}
