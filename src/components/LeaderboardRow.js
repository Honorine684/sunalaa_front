const medalImages = {
  1: "/images/Medals.png",
  2: "/images/Silver.png",
  3: "/images/Medals (1).png",
};

function getRankDisplay(rank) {
  if (rank <= 3) {
    return (
      <img
        src={medalImages[rank]}
        alt={`Rang ${rank}`}
        width={36}
        height={36}
        style={{ objectFit: "contain" }}
      />
    );
  }
  return (
    <span className="text-[17px] font-normal text-gray-600 tracking-wide">
      {String(rank).padStart(3, "0")}
    </span>
  );
}

function getRowBg(rank) {
  if (rank === 7) return "bg-primary";
  if (rank === 1 || rank === 3) return "bg-[#f5efd4]";
  if (rank === 2) return "bg-white";
  return rank % 2 === 0 ? "bg-gray-50" : "bg-white";
}

function Avatar() {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-700 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
          stroke="#ccc"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function LeaderboardRow({ rank, username, subtitle, country, score }) {
  const isHighlighted = rank === 7;
  const bg = getRowBg(rank);
  const textColor = isHighlighted ? "text-white" : "text-gray-700";
  const subColor = isHighlighted ? "text-white/50" : "text-gray-400";
  const countryColor = isHighlighted ? "text-white/70" : "text-gray-500";

  return (
    <div className={`${bg} flex items-center px-3 lg:px-6 py-3 lg:py-4 gap-3 lg:gap-4 hover:brightness-[0.97] transition`}>
      {/* Rank */}
      <div className="w-12 shrink-0 flex items-center justify-center">
        {getRankDisplay(rank)}
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar />
        <div className="min-w-0">
          <p className={`${textColor} font-normal text-[12px] lg:text-[14px] tracking-wide truncate`}>
            {username}
          </p>
          <p className={`${subColor} text-[12px] truncate`}>{subtitle}</p>
        </div>
      </div>

      {/* Country */}
      <div className="w-32 hidden sm:block">
        <p className={`${countryColor} text-[13px] font-normal tracking-widest`}>
          {country}
        </p>
      </div>

      {/* Score */}
      <div className="w-28 text-right shrink-0">
        <p className={`${textColor} font-normal text-[12px] lg:text-[14px]`}>
          {score}{" "}
          <span className={`${subColor} text-[12px]`}>SNL</span>
        </p>
      </div>
    </div>
  );
}
