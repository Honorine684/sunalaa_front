export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const authorization = request.headers.get("Authorization")
    ?? (() => {
      const token = cookieHeader.match(/snl_access_token=([^;]+)/)?.[1];
      return token ? `Bearer ${token}` : null;
    })();

  const incoming = await request.formData();
  const file = incoming.get("file");

  const outgoing = new FormData();
  if (file) {
    const filename = file.name && file.name !== "undefined"
      ? file.name
      : `media_${Date.now()}`;
    outgoing.append("file", new Blob([await file.arrayBuffer()], { type: file.type || "application/octet-stream" }), filename);
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";
  const targetUrl = `${apiBase}/uploads/media`;
  console.log("[upload-media] POST", targetUrl);
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      ...(authorization ? { Authorization: authorization } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: outgoing,
  });
  console.log("[upload-media] backend status:", response.status);
  const data = await response.json().catch(() => ({}));
  console.log("[upload-media] backend response:", data);
  return Response.json(data, { status: response.status });
}
