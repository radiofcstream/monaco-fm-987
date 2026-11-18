import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const store = () => getStore("monaco-fm-content");
const COOKIE = "monaco_admin";
const enc = (s) => Buffer.from(s).toString("base64url");
const sign = (v) => crypto.createHmac("sha256", process.env.SESSION_SECRET || "SET_A_LONG_RANDOM_SESSION_SECRET").update(v).digest("base64url");
const token = () => {
  const payload = enc(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 }));
  return `${payload}.${sign(payload)}`;
};
function valid(req) {
  const raw = (req.headers.get("cookie") || "").split(";").map(x => x.trim()).find(x => x.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  if (!raw) return false;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || sign(payload) !== signature) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}
const json = (data, status=200, headers={}) => new Response(JSON.stringify(data), { status, headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", ...headers } });
const cookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
async function readData() {
  return await (await store()).get("site-data", { type:"json" }) || { news:[], programs:[] };
}
export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/?/, "");
  if (req.method === "GET" && path === "content") return json(await readData());
  if (req.method === "POST" && path === "login") {
    const body = await req.json().catch(() => ({}));
    const expected = process.env.NEWS_ADMIN_PASSWORD;
    if (!expected) return json({ error:"Falta configurar NEWS_ADMIN_PASSWORD en Netlify." }, 503);
    if (body.password !== expected) return json({ error:"Contraseña incorrecta." }, 401);
    return json({ ok:true }, 200, { "set-cookie":cookie(token(), 28800) });
  }
  if (req.method === "POST" && path === "logout") return json({ ok:true }, 200, { "set-cookie":cookie("", 0) });
  if (req.method === "GET" && path === "session") return json({ authenticated:valid(req) });
  if (req.method === "POST" && path === "content") {
    if (!valid(req)) return json({ error:"No autorizado." }, 401);
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.news) || !Array.isArray(body.programs)) return json({ error:"Datos inválidos." }, 400);
    const size = Buffer.byteLength(JSON.stringify(body));
    if (size > 20 * 1024 * 1024) return json({ error:"El contenido supera 20 MB. Reducí el tamaño de las fotos." }, 413);
    await (await store()).setJSON("site-data", body);
    return json({ ok:true });
  }
  return json({ error:"No encontrado." }, 404);
};
export const config = { path: "/api/*" };
