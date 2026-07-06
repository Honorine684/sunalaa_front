import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/context/AuthContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import PwaRegister from "@/components/PwaRegister";
import PushNotifPrompt from "@/components/PushNotifPrompt";
import IOSInstallBanner from "@/components/IOSInstallBanner";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} translate="no" className="notranslate">
      <head>
        <link rel="preconnect" href="https://api.sunalaa.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.sunalaa.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ErrorBoundary>
              <AnnouncementBanner />
            </ErrorBoundary>
            {children}
            <PwaRegister />
            <PushNotifPrompt />
            <IOSInstallBanner />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
