import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(`${API}/stats/public`, { next: { revalidate: 300 } });
    if (!res.ok) return NextResponse.json({ members: null, totalPoints: null });

    const json = await res.json();
    const d = json?.data?.data ?? json?.data ?? json ?? {};

    const members     = d.totalUsers              != null ? Number(d.totalUsers)              : null;
    const totalPoints = d.totalPointsDistributed != null ? Number(d.totalPointsDistributed) : null;

    return NextResponse.json({ members, totalPoints });
  } catch {
    return NextResponse.json({ members: null, totalPoints: null });
  }
}
