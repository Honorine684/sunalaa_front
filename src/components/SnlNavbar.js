import Link from "next/link";
import Image from "next/image";

export default function SnlNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-white" style={{ borderBottom: "1px solid rgba(31,78,70,0.10)" }}>
      <Link href="/">
        <Image src="/images/logo Sunaala.png" alt="SUNALA" width={120} height={36} style={{ height: 36, width: "auto", objectFit: "contain" }} />
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1.5 hover:opacity-70 text-[13px] transition-opacity font-medium" style={{ color: "#1F4E46" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour au site
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 font-semibold text-[13px] text-white px-4 py-2 rounded-full transition hover:brightness-90"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          Rejoindre
        </Link>
      </div>
    </nav>
  );
}
