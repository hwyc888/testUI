import { json, currentUser, publicUser } from "../../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "尚未登录" }, 401);
  return json({ user: publicUser(user) });
}
