import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://sunalaa.com"),
  title: {
    default: "SUNALAA — Collect SNL points every day",
    template: "%s | SUNALAA",
  },
  description:
    "SUNALAA lets you collect SNL points daily, refer your network and earn bonuses together.",
  authors: [{ name: "SUNALAA", url: "https://sunalaa.com" }],
  creator: "SUNALAA",
  publisher: "SUNALAA",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F4E46" },
    { media: "(prefers-color-scheme: dark)", color: "#1F4E46" },
  ],
};

// Root layout — no html/body here, [locale]/layout.js handles it
export default function RootLayout({ children }) {
  return children;
}
