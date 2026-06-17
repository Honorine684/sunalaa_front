import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://sunalaa.com"),
  title: {
    default: "SUNALA — Collect SNL points every day",
    template: "%s | SUNALA",
  },
  description:
    "SUNALA lets you collect SNL points daily, refer your network and earn bonuses together.",
  authors: [{ name: "SUNALA", url: "https://sunalaa.com" }],
  creator: "SUNALA",
  publisher: "SUNALA",
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
  appleWebApp: {
    capable: true,
    title: "SUNALA",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F4E46" },
    { media: "(prefers-color-scheme: dark)", color: "#1F4E46" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
