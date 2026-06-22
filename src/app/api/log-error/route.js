export async function POST(request) {
  try {
    const body = await request.json();
    const { message, stack, url, ts, level = "page" } = body;

    // Log server-side only (visible in production server logs / VPS stdout)
    console.error(`[client-error][${level}] ${ts} ${url}\n${message}\n${stack ?? ""}`);

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}
