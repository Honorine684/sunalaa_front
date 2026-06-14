export async function POST(request) {
  const authorization = request.headers.get("Authorization");

  const incoming = await request.formData();
  const fileEntry = incoming.get("avatar");

  // Reconstruire le FormData avec le vrai nom de fichier
  const outgoing = new FormData();
  if (fileEntry) {
    const filename = fileEntry.name && fileEntry.name !== "undefined"
      ? fileEntry.name
      : `avatar_${Date.now()}.jpg`;
    outgoing.append("avatar", new Blob([await fileEntry.arrayBuffer()], { type: fileEntry.type || "image/jpeg" }), filename);
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";
  const response = await fetch(
    `${apiBase}/users/me/profile/avatar`,
    {
      method: "POST",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: outgoing,
    }
  );

  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
