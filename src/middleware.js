import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const API_BASE = "https://api.sunalaa.com/api/v1";

const intlMiddleware = createMiddleware(routing);

async function isMaintenanceMode() {
  try {
    const res = await fetch(`${API_BASE}/settings/maintenance`, {
      signal: AbortSignal.timeout(2000),
    });
    const json = await res.json();
    const val = json?.data?.value ?? json?.data?.maintenance ?? json?.maintenance ?? json?.value;
    return val === true || val === "true";
  } catch {
    return false;
  }
}

const PRIVATE_PATHS = ["/profil", "/setup-username"];
const AUTH_PATHS    = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

function stripLocale(pathname) {
  return pathname.replace(/^\/(fr)/, "") || "/";
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Admin : vérification du rôle côté serveur — snl_user_role ignoré
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("snl_access_token")?.value;
    if (!token) return new NextResponse(null, { status: 404 });
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Cookie: `snl_access_token=${token}` },
        signal: AbortSignal.timeout(3000),
        cache: "no-store",
      });
      console.error("[admin-auth] status:", res.status);
      if (!res.ok) return new NextResponse(null, { status: 404 });
      const json = await res.json();
      const role = (json?.data?.data?.role ?? json?.data?.role ?? json?.role ?? "").toUpperCase();
      console.error("[admin-auth] role:", role, "raw:", JSON.stringify(json).slice(0, 200));
      if (role !== "ADMIN") return new NextResponse(null, { status: 404 });
    } catch (err) {
      console.error("[admin-auth] fetch /auth/me failed:", err?.message ?? err);
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  const cleanPath = stripLocale(pathname);
  if (!cleanPath.startsWith("/maintenance")) {
    const maintenance = await isMaintenanceMode();
    if (maintenance) {
      const locale = pathname.startsWith("/fr") ? "/fr" : "";
      return NextResponse.redirect(new URL(`${locale}/maintenance`, request.url));
    }
  }

  // snl_access_token est HttpOnly → lisible côté serveur, non forgeable par JS client
  const hasToken = !!request.cookies.get("snl_access_token")?.value;

  const isPrivate  = PRIVATE_PATHS.some((p) => cleanPath.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => cleanPath.startsWith(p));

  if (isPrivate && !hasToken) {
    const locale = pathname.startsWith("/fr") ? "/fr" : "";
    const loginUrl = new URL(`${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && hasToken) {
    const locale = pathname.startsWith("/fr") ? "/fr" : "";
    return NextResponse.redirect(new URL(`${locale}/profil`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|sw\\.js|images/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot)).*)",
  ],
};
