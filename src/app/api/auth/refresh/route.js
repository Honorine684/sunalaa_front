import { API_BASE, relaySetCookies } from "../_proxy";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let backendRes;
  try {
    backendRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({}),
    });
  } catch {
    return Response.json({ message: "Refresh unavailable" }, { status: 503 });
  }

  const data = await backendRes.json().catch(() => ({}));
  const res  = Response.json(data, { status: backendRes.status });
  relaySetCookies(backendRes, res);
  return res;
}
