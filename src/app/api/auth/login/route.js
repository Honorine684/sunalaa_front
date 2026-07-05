import { API_BASE, relaySetCookies } from "../_proxy";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }

  let backendRes;
  try {
    backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": request.headers.get("Accept-Language") ?? "en",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return Response.json({ message: "Login unavailable" }, { status: 503 });
  }

  const data = await backendRes.json().catch(() => ({}));
  const res  = Response.json(data, { status: backendRes.status });
  relaySetCookies(backendRes, res);
  return res;
}
