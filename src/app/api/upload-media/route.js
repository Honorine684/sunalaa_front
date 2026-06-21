export async function POST(request) {
  const authorization = request.headers.get("Authorization");

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
  const response = await fetch(`${apiBase}/uploads/media`, {
    method: "POST",
    headers: { ...(authorization ? { Authorization: authorization } : {}) },
    body: outgoing,
  });

  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
