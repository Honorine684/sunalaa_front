import Link from "next/link";

export default function QuickAccessCard({ icon, iconBg, title, desc, href = "#" }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[15px] font-bold mb-1 transition-colors" style={{ color: "#1F4E46" }}>{title}</p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{desc}</p>
      </div>
    </Link>
  );
}
