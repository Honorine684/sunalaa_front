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

const PRIVATE_PATHS = ["/collecter", "/bonus", "/profil", "/admin", "/setup-username"];
const AUTH_PATHS    = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

function stripLocale(pathname) {
  return pathname.replace(/^\/(fr)/, "") || "/";
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/auth/callback")) {
    if (pathname.startsWith("/admin")) {
      const rawToken = request.cookies.get("snl_access_token")?.value;
      const token = rawToken && rawToken !== "null" && rawToken !== "undefined" ? rawToken : null;
      if (token) {
        const role = request.cookies.get("snl_user_role")?.value ?? "user";
        if (!role.includes("admin")) {
          return NextResponse.redirect(new URL("/profil", request.url));
        }
      }
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

  const rawToken = request.cookies.get("snl_access_token")?.value;
  const token = rawToken && rawToken !== "null" && rawToken !== "undefined" ? rawToken : null;

  const isPrivate  = PRIVATE_PATHS.some((p) => cleanPath.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => cleanPath.startsWith(p));

  if (isPrivate && !token) {
    const locale = pathname.startsWith("/fr") ? "/fr" : "";
    const loginUrl = new URL(`${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    const role = request.cookies.get("snl_user_role")?.value ?? "user";
    const locale = pathname.startsWith("/fr") ? "/fr" : "";
    const home = role.includes("admin") ? "/admin" : `${locale}/profil`;
    return NextResponse.redirect(new URL(home, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|images/|sw\\.js).*)",
  ],
};
