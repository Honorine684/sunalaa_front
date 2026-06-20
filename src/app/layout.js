import "./globals.css";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SUNALA",
    url: "https://sunalaa.com",
    logo: "https://sunalaa.com/images/sunala_LOGO.png",
    sameAs: [],
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
  openGraph: {
    type: "website",
    siteName: "SUNALA",
    locale: "fr_FR",
    images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sunalaa",
    images: ["/images/sunala_LOGO.png"],
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
