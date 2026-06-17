import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: false,
});

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className={`${inter.className} antialiased`}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
}
