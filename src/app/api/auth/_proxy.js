// Shared helper — relays backend Set-Cookie headers scoped to sunalaa.com
// so HttpOnly auth cookies are set same-origin and sent reliably by all browsers.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

export function relaySetCookies(backendRes, res) {
  // getSetCookie() returns an array — safe with commas inside cookie values
  const cookies = backendRes.headers.getSetCookie?.() ?? [];
  cookies.forEach((cookie) => {
    const cleaned = cookie
      // Replace any Domain with .sunalaa.com so the cookie applies to all subdomains
      // (api.sunalaa.com receives it too via withCredentials same-site requests)
      .replace(/;\s*domain=[^;]*/gi, "; Domain=sunalaa.com")
      .replace(/;\s*samesite=none/gi, "; SameSite=Lax");
    res.headers.append("Set-Cookie", cleaned);
  });
}
