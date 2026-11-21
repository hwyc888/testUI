import { json, readJson, sameOrigin, currentUser } from "../../_lib/auth.js";

export async function onRequestPatch({ request, env, params }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const user = await currentUser(request, env);
  if (!user) return json({ error: "请先登录" }, 401);
  if (user.role !== "admin") return json({ error: "只有管理员可以审核报名" }, 403);

  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const status = String(body.status || "");
  const note = String(body.admin_note || "").trim();
  if (!["已录取", "已退回"].includes(status)) return json({ error: "审核状态无效" }, 400);
  if (note.length > 300) return json({ error: "审核备注不能超过 300 个字符" }, 400);

  const result = await env.DB.prepare(
    "UPDATE applications SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?"
  ).bind(status, note || null, new Date().toISOString(), params.id).run();
  if (!result.meta?.changes) return json({ error: "未找到该报名记录" }, 404);
  const application = await env.DB.prepare("SELECT * FROM applications WHERE id = ?").bind(params.id).first();
  return json({ ok: true, application });
}
