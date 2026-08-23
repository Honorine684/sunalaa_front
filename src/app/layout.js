import "./globals.css";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SUNALA",
    url: "https://sunalaa.com",
    logo: "https://sunalaa.com/images/sunala_LOGO.png",
    sameAs: [
      "https://t.me/sunala_agri",
      "https://x.com/sunala_universe",
      "https://discord.gg/cQhSUWrHd",
      "https://www.facebook.com/share/1Dc2MhmXGj/",
      "https://www.instagram.com/sunala.universe",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SUNALA",
    url: "https://sunalaa.com",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://sunalaa.com/formations?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  },
];

export const metadata = {
  metadataBase: new URL("https://sunalaa.com"),
  title: {
    default: "SUNALA : Collect SNL points every day",
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
    icon: "/icon-192.png",
    apple: "/icon-192.png",
    shortcut: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "SUNALA",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "SUNALA",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "SUNALA : Collectez des points SNL chaque jour" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sunalaa",
    images: ["/og.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F4E46" },
    { media: "(prefers-color-scheme: dark)", color: "#1F4E46" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning translate="no" className="notranslate">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
