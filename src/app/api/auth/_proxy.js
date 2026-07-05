// Shared helper — relays backend Set-Cookie headers scoped to sunalaa.com
// so HttpOnly auth cookies are set same-origin and sent reliably by all browsers.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

function transformCookie(cookie) {
  return cookie.trim()
    .replace(/;\s*domain=[^;]*/gi, "; Domain=sunalaa.com")
    .replace(/;\s*samesite=none/gi, "; SameSite=Lax");
}

export function relaySetCookies(backendRes, res) {
  let cookies = [];

  if (typeof backendRes.headers.getSetCookie === "function") {
    // Node 18.5+ / undici — returns proper array, safe with commas in values
    cookies = backendRes.headers.getSetCookie();
  } else {
    // Fallback: split on commas not inside Expires date (e.g. "Fri, 01 Jan")
    const raw = backendRes.headers.get("set-cookie") ?? "";
    if (raw) cookies = raw.split(/,(?=[a-zA-Z_][a-zA-Z0-9_-]*=)/);
  }

  cookies.forEach((cookie) => {
    res.headers.append("Set-Cookie", transformCookie(cookie));
  });
}
