export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/bonus", "/classement", "/collecter", "/formations", "/snl"],
        disallow: [
          "/admin/",
          "/profil",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/maintenance",
          "/api/",
        ],
      },
    ],
    sitemap: "https://sunalaa.com/sitemap.xml",
    host: "https://sunalaa.com",
  };
}
