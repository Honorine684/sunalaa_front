import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed", // English = /, French = /fr/
  localeDetection: false,    // URL seule détermine la locale, pas le cookie
});
