import { NextResponse } from "next/server";

// userId → { ts, displayName, email }
const store = new Map();
const blacklist = new Set(); // userIds supprimés — leurs pings sont ignorés
const WINDOW_MS = 90 * 1000;

function cleanup() {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, entry] of store) {
    if (entry.ts < cutoff) store.delete(id);
  }
}

export async function POST(req) {
  try {
    const { userId, displayName, email } = await req.json();
    if (!userId) return NextResponse.json({ ok: false }, { status: 400 });
    const id = String(userId);
    if (blacklist.has(id)) return NextResponse.json({ ok: true }); // utilisateur supprimé, ping ignoré
    store.set(id, { ts: Date.now(), displayName: displayName || null, email: email || null });
    cleanup();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ ok: false }, { status: 400 });
    const id = String(userId);
    store.delete(id);
    blacklist.add(id); // bloquer les futurs pings de cet utilisateur supprimé
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  cleanup();
  const users = [...store.entries()].map(([id, { ts, displayName, email }]) => ({
    userId: id,
    displayName,
    email,
    lastSeen: ts,
  }));
  users.sort((a, b) => b.lastSeen - a.lastSeen);
  return NextResponse.json({ count: store.size, users });
}
