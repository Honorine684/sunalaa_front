import LeaderboardRow from "./LeaderboardRow";

const players = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  username: "LOVERLS_PLAYER",
  subtitle: "Skale Enjoyoor",
  country: "FRANCE",
  score: "1,249",
  avatar: null,
}));

function TableHeader() {
  return (
    <div className="flex items-center px-6 py-3 gap-4 border-b border-gray-100">
      <div className="w-14 shrink-0" />
      <div className="flex-1">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">
          NOM
        </p>
      </div>
      <div className="w-32 hidden sm:block">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">
          PAYS
        </p>
      </div>
      <div className="w-28 text-right shrink-0">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">
          TOTAL SNL
        </p>
      </div>
    </div>
  );
}

export default function LeaderboardTable() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <TableHeader />
      <div className="overflow-x-auto">
        {players.map((player) => (
          <LeaderboardRow key={player.rank} {...player} />
        ))}
      </div>
    </div>
  );
}
