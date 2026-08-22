function toFlag(code) {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().split("").map((c) =>
    String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1f1e6)
  ).join("");
}

const medalImages = {
  1: "/images/Medals.png",
  2: "/images/Silver.png",
  3: "/images/Medals (1).png",
};

function getRankDisplay(rank, isMe) {
  if (rank <= 3) {
    return (
      <img src={medalImages[rank]} alt={`Rank ${rank}`} width={36} height={36} style={{ objectFit: "contain" }} />
    );
  }
  return (
    <span className="text-[17px] font-normal tracking-wide" style={{ color: isMe ? "white" : "#4B5563" }}>
      {String(rank).padStart(3, "0")}
    </span>
  );
}

function getRowBg(rank, isMe) {
  if (isMe) return "bg-primary";
  if (rank === 1 || rank === 3) return "bg-[#f5efd4]";
  if (rank === 2) return "bg-white";
  return rank % 2 === 0 ? "bg-gray-50" : "bg-white";
}

function Avatar({ avatar, username }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }
  const initials = (username ?? "?").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-700 flex items-center justify-center">
      <span className="text-white text-[13px] font-bold">{initials}</span>
    </div>
  );
}

export default function LeaderboardRow({ rank, username, subtitle, country, score, avatar, isMe }) {
  const bg         = getRowBg(rank, isMe);
  const textColor  = isMe ? "text-white" : "text-gray-700";
  const subColor   = isMe ? "text-white/50" : "text-gray-400";
  const countryColor = isMe ? "text-white/70" : "text-gray-500";

  return (
    <div className={`${bg} flex items-center px-3 lg:px-6 py-3 lg:py-4 gap-3 lg:gap-4 hover:brightness-[0.97] transition`}>
      {/* Rank */}
      <div className="w-12 shrink-0 flex items-center justify-center">
        {getRankDisplay(rank, isMe)}
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar avatar={avatar} username={username} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={`${textColor} font-normal text-[12px] lg:text-[14px] tracking-wide truncate`}>
              {username}
            </p>
            {country && (
              <span className="shrink-0 text-[14px] sm:hidden" title={country}>
                {toFlag(country)}
              </span>
            )}
            {isMe && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0" style={{ backgroundColor: "#3FAE8C", color: "#fff" }}>
                You
              </span>
            )}
          </div>
          {subtitle && <p className={`${subColor} text-[12px] truncate`}>{subtitle}</p>}
        </div>
      </div>

      {/* Country */}
      <div className="w-32 hidden sm:block">
        <p className={`${countryColor} text-[13px] font-normal flex items-center gap-1.5`}>
          {country && <span className="text-[16px]">{toFlag(country)}</span>}
          {country}
        </p>
      </div>

      {/* Score */}
      <div className="w-28 text-right shrink-0">
        <p className={`${textColor} font-normal text-[12px] lg:text-[14px]`}>
          {score} <span className={`${subColor} text-[12px]`}>SNL</span>
        </p>
      </div>
    </div>
  );
}
