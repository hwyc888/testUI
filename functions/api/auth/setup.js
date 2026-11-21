import { json, readJson, sameOrigin, hashPassword, createSession, sessionCookie, newId, validPassword, secureCompare, publicUser } from "../../_lib/auth.js";

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
  return json({
    initialized: Number(row?.count || 0) > 0,
    setupAvailable: Boolean(env.APP_SETUP_KEY)
  });
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  if (!env.APP_SETUP_KEY) return json({ error: "系统初始化密钥尚未配置，请联系系统管理员" }, 503);
  const suppliedKey = request.headers.get("X-Setup-Key") || "";
  if (!(await secureCompare(suppliedKey, env.APP_SETUP_KEY))) return json({ error: "初始化密钥不正确，请检查是否完整复制" }, 403);

  const existing = await env.DB.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").first();
  if (existing) return json({ error: "管理员已经初始化，请返回管理员登录页面" }, 409);

  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const username = String(body.username || "").trim().toLowerCase();
  const fullName = String(body.full_name || "").trim();
  const password = String(body.password || "");
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) return json({ error: "管理员账号需为 3–32 位英文、数字或 . _ -" }, 400);
  if (!fullName || fullName.length > 30) return json({ error: "请填写管理员姓名" }, 400);
  if (!validPassword(password, 12)) return json({ error: "管理员密码至少 12 位，最多 128 位" }, 400);

  let stage = "密码加密";
  try {
    const id = newId("usr");
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);

    stage = "写入管理员账号";
    await env.DB.prepare(
      "INSERT INTO users (id, username, password_hash, role, full_name, phone, created_at) VALUES (?, ?, ?, 'admin', ?, NULL, ?)"
    ).bind(id, username, passwordHash, fullName, now).run();

    stage = "创建登录会话";
    let token;
    try {
      token = await createSession({ id, username, role: "admin", full_name: fullName }, env);
    } catch (error) {
      await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
      throw error;
    }

    const user = { id, username, role: "admin", full_name: fullName };
    return json({ ok: true, user: publicUser(user) }, 201, { "Set-Cookie": sessionCookie(token) });
  } catch (error) {
    const message = String(error?.message || error);
    console.error("ADMIN_SETUP_FAILED", JSON.stringify({ stage, name: error?.name || "Error", message }));
    if (message.includes("UNIQUE")) return json({ error: "管理员账号已存在，请换一个账号名称" }, 409);
    return json({
      error: "管理员初始化失败，出错阶段：" + stage + "。请将此提示反馈给系统维护人员。",
      code: "ADMIN_SETUP_FAILED",
      stage
    }, 500);
  }
}
