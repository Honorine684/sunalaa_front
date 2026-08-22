import { NextResponse } from "next/server";

// Module-level store — persists for the lifetime of the process (single Docker container)
// userId (string) → last-seen timestamp (ms)
const store = new Map();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function cleanup() {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, ts] of store) {
    if (ts < cutoff) store.delete(id);
  }
}

// Called by logged-in users every 30s to signal presence
export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ ok: false }, { status: 400 });
    store.set(String(userId), Date.now());
    cleanup();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

// Admin dashboard polls this to get online count
export async function GET() {
  cleanup();
  return NextResponse.json({ count: store.size });
}
