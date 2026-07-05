const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1").replace("/api/v1", "");

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  let backendRes;
  try {
    backendRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({}),
    });
  } catch {
    return Response.json({ message: "Refresh failed" }, { status: 503 });
  }

  const data = await backendRes.json().catch(() => ({}));
  const res  = Response.json(data, { status: backendRes.status });

  // Relay Set-Cookie headers from backend → browser, stripping Domain so they
  // are scoped to sunalaa.com (the proxy host) instead of api.sunalaa.com
  const raw = backendRes.headers.get("set-cookie");
  if (raw) {
    raw.split(/,(?=[^ ])/).forEach((cookie) => {
      const cleaned = cookie.replace(/;\s*domain=[^;]*/gi, "");
      res.headers.append("Set-Cookie", cleaned);
    });
  }

  return res;
}
