const users = [
  { name: "Shelby Goode", status: "Online", snl: 100, initials: "SG", color: "#8B5CF6" },
  { name: "Robert Bacins", status: "Busy",   snl: 100, initials: "RB", color: "#3B82F6" },
  { name: "John Carilo",   status: "Online", snl: 100, initials: "JC", color: "#10B981" },
  { name: "Adriene",       status: "Online", snl: 100, initials: "AD", color: "#F59E0B" },
];

export default function ProfileNetwork() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: "100%", color: "#0F172B" }}>Votre réseau</h3>
        <span className="text-[15px] font-bold text-slate-400">
          {String(users.length).padStart(2, "0")}
        </span>
      </div>

      {/* User list */}
      <div className="flex flex-col">
        {users.map((user, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i < users.length - 1 ? "border-b border-slate-100" : ""}`}>
            {/* Avatar with status dot */}
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                style={{ backgroundColor: user.color }}
              >
                {user.initials}
              </div>
              {/* Status dot */}
              <span
                className={[
                  "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                  user.status === "Online" ? "bg-emerald-400" : "bg-orange-400",
                ].join(" ")}
              />
            </div>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-[14px] lg:text-[18px]" style={{ fontWeight: 500, lineHeight: "100%", color: "#4D4D4D" }}>{user.name}</p>
              <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, lineHeight: "100%", color: "#94A3B8" }}>{user.status}</p>
            </div>

            {/* SNL */}
            <span className="shrink-0" style={{ fontSize: 12, fontWeight: 500, lineHeight: "100%", color: "#94A3B8" }}>{user.snl} SNL</span>
          </div>
        ))}
      </div>
    </div>
  );
}
