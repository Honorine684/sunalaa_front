import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import "@/app/globals.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: false,
});

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("snl_access_token")?.value;

  if (!token) return redirect("/login");

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: `snl_access_token=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return redirect("/login");
    const json = await res.json();
    const role = (json?.data?.data?.role ?? json?.data?.role ?? json?.role ?? "").toUpperCase();
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) return redirect("/login");
  } catch {
    // API timeout — on laisse passer, le middleware a déjà vérifié
    return notFound();
  }

  return (
    <div className={`${inter.className} antialiased`}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
}
