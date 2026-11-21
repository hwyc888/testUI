import { json, readJson, sameOrigin, currentUser, newId } from "../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "请先登录" }, 401);

  if (user.role === "admin") {
    const rows = await env.DB.prepare(
      "SELECT a.id, a.user_id, a.student_name, a.gender, a.phone, a.school, a.major, a.source, a.status, a.admin_note, a.created_at, a.updated_at, u.username " +
      "FROM applications a JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC"
    ).all();
    return json({ applications: rows.results || [] });
  }

  const row = await env.DB.prepare(
    "SELECT id, student_name, gender, phone, school, major, source, status, admin_note, created_at, updated_at " +
    "FROM applications WHERE user_id = ?"
  ).bind(user.id).first();
  return json({ application: row || null });
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const user = await currentUser(request, env);
  if (!user) return json({ error: "请先登录" }, 401);
  if (user.role !== "student") return json({ error: "只有学生账号可以提交报名" }, 403);

  const body = await readJson(request);
  if (!body) return json({ error: "提交内容格式不正确" }, 400);
  const studentName = String(body.student_name || "").trim();
  const gender = String(body.gender || "");
  const phone = String(body.phone || "").trim();
  const school = String(body.school || "").trim();
  const major = String(body.major || "").trim();
  if (!studentName || studentName.length > 30) return json({ error: "请填写学生姓名" }, 400);
  if (!["男", "女"].includes(gender)) return json({ error: "请选择性别" }, 400);
  if (!/^1[3-9]\d{9}$/.test(phone)) return json({ error: "请输入有效的联系电话" }, 400);
  if (!school || school.length > 100) return json({ error: "请填写毕业学校" }, 400);
  if (!major || major.length > 80) return json({ error: "请选择意向专业" }, 400);

  const existing = await env.DB.prepare("SELECT id, status FROM applications WHERE user_id = ?").bind(user.id).first();
  if (existing?.status === "已录取") return json({ error: "报名已录取，如需修改请联系招生办公室" }, 409);

  const now = new Date().toISOString();
  if (existing) {
    await env.DB.prepare(
      "UPDATE applications SET student_name = ?, gender = ?, phone = ?, school = ?, major = ?, status = '待审核', admin_note = NULL, updated_at = ? WHERE user_id = ?"
    ).bind(studentName, gender, phone, school, major, now, user.id).run();
    const updated = await env.DB.prepare("SELECT * FROM applications WHERE user_id = ?").bind(user.id).first();
    return json({ ok: true, application: updated, message: "报名资料已更新并重新提交审核" });
  }

  const id = newId("app");
  await env.DB.prepare(
    "INSERT INTO applications (id, user_id, student_name, gender, phone, school, major, source, status, created_at, updated_at) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?, '学生自主报名', '待审核', ?, ?)"
  ).bind(id, user.id, studentName, gender, phone, school, major, now, now).run();
  const created = await env.DB.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first();
  return json({ ok: true, application: created, message: "报名资料已提交，请留意审核进度" }, 201);
}
