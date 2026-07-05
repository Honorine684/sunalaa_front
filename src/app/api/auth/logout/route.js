import { API_BASE, relaySetCookies } from "../_proxy";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let backendRes;
  try {
    backendRes = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({}),
    });
  } catch {
    // Logout best-effort — always succeed client-side
    return new Response(null, { status: 204 });
  }

  const res = new Response(null, { status: backendRes.status });
  relaySetCookies(backendRes, res);
  return res;
}
