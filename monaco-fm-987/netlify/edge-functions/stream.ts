export default async () => {
  const upstream = "http://uk2freenew.listen2myradio.com:29986/stream";
  try {
    const response = await fetch(upstream, { headers: { "Icy-MetaData": "0" } });
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "no-store");
    headers.set("Content-Type", response.headers.get("content-type") || "audio/mpeg");
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return new Response("No se pudo conectar con la señal de radio.", { status: 502 });
  }
};
export const config = { path: "/radio-stream" };
