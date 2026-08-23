import { NextResponse } from "next/server";

const API_BASE = "https://api.sunalaa.com/api/v1";

// userId → { ts, displayName, email }
const store = new Map();
// userIds supprimés/invalides — leurs pings sont ignorés
const blacklist = new Set();
// userId → { valid: bool, ts: number } — évite un appel /auth/me à chaque ping
const validationCache = new Map();

const WINDOW_MS = 90 * 1000;
const VALIDATION_TTL = 60 * 1000; // re-valider au maximum toutes les 60s

function cleanup() {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, entry] of store) {
    if (entry.ts < cutoff) store.delete(id);
  }
}

async function isTokenValid(userId, token) {
  const cached = validationCache.get(userId);
  if (cached && Date.now() - cached.ts < VALIDATION_TTL) return cached.valid;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: `snl_access_token=${token}` },
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    // 401 ou 403 = token blacklisté ou user supprimé
    const valid = res.status !== 401 && res.status !== 403;
    validationCache.set(userId, { valid, ts: Date.now() });
    return valid;
  } catch {
    // Erreur réseau → on suppose valide pour éviter les faux positifs
    return true;
  }
}

export async function POST(req) {
  try {
    const { userId, displayName, email } = await req.json();
    if (!userId) return NextResponse.json({ ok: false }, { status: 400 });
    const id = String(userId);

    if (blacklist.has(id)) return NextResponse.json({ ok: true });

    // Extraire le token depuis les cookies de la requête (cookie HttpOnly envoyé automatiquement)
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/snl_access_token=([^;]+)/);
    const token = match?.[1];

    if (token) {
      const valid = await isTokenValid(id, token);
      if (!valid) {
        store.delete(id);
        blacklist.add(id);
        return NextResponse.json({ ok: true }); // silencieux côté client
      }
    }

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
    blacklist.add(id);
    validationCache.set(id, { valid: false, ts: Date.now() });
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
