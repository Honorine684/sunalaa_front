import Link from "next/link";

const users = [
  { initials: "CR", name: "crypto_master", email: "crypto@example.com", points: "1,250", status: "Actif", date: "2025-12-29", color: "#3FAE8C" },
  { initials: "MO", name: "moon_walker",   email: "moon@example.com",   points: "890",   status: "Actif", date: "2025-12-29", color: "#3FAE8C" },
  { initials: "HO", name: "hodl_king",     email: "hodl@example.com",   points: "2,340", status: "Actif", date: "2025-12-28", color: "#3FAE8C" },
  { initials: "DE", name: "degen_trader",  email: "degen@example.com",  points: "450",   status: "Actif", date: "2025-12-28", color: "#3FAE8C" },
  { initials: "AI", name: "airdrop_hunter",email: "airdrop@example.com",points: "1,890", status: "Actif", date: "2025-12-27", color: "#3FAE8C" },
];

export default function UserTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold" style={{ color: "#1F4E46" }}>Utilisateurs récents</h2>
        <Link href="#" className="flex items-center gap-1 text-[13px] text-secondary hover:opacity-70 transition">
          Voir tout
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
      <div className="bg-white min-w-[560px]">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
          {["UTILISATEUR", "EMAIL", "POINTS SNL", "STATUT", "INSCRIPTION"].map((col) => (
            <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
          ))}
        </div>

        {/* Rows */}
        {users.map((user, i) => (
          <div
            key={i}
            className={[
              "grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
              i < users.length - 1 ? "border-b border-slate-100" : "",
            ].join(" ")}
          >
            {/* User */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: user.color }}
              >
                <span className="text-white text-[12px] font-bold">{user.initials}</span>
              </div>
              <span className="text-[14px] font-normal" style={{ color: "#45556C" }}>{user.name}</span>
            </div>
            {/* Email */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.email}</span>
            {/* Points */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.points}</span>
            {/* Status */}
            <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[12px] font-normal border" style={{ backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }}>
              {user.status}
            </span>
            {/* Date */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.date}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
