import { json, getCookie, currentUser, clearSessionCookie, sameOrigin } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: "请求来源无效" }, 403);
  const token = getCookie(request);
  if (token) {
    const user = await currentUser(request, env);
    if (user) {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
      let binary = "";
      for (const byte of new Uint8Array(digest)) binary += String.fromCharCode(byte);
      const tokenHash = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
    }
  }
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
