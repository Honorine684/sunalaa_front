const BASE = "https://sunalaa.com";

const PAGES = [
  { path: "",           freq: "daily",   priority: 1.0 },
  { path: "/bonus",     freq: "weekly",  priority: 0.9 },
  { path: "/collecter", freq: "daily",   priority: 0.9 },
  { path: "/classement",freq: "daily",   priority: 0.8 },
  { path: "/formations",freq: "weekly",  priority: 0.8 },
  { path: "/snl",       freq: "monthly", priority: 0.7 },
  { path: "/snl/usage", freq: "monthly", priority: 0.6 },
  { path: "/snl/utilite",freq: "monthly",priority: 0.6 },
  { path: "/snl/valeur",freq: "monthly", priority: 0.6 },
];

export default function sitemap() {
  const now = new Date();
  const entries = [];

  for (const { path, freq, priority } of PAGES) {
    // English (default, no prefix)
    entries.push({ url: `${BASE}${path}`, lastModified: now, changeFrequency: freq, priority });
    // French
    entries.push({ url: `${BASE}/fr${path}`, lastModified: now, changeFrequency: freq, priority: priority - 0.05 });
  }

  return entries;
}
