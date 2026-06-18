export default function ProfileHero() {
  const coins = [
    { x: "3%",  size: 30, op: 0.55, dur: 9,  del: 0   },
    { x: "10%", size: 20, op: 0.4,  dur: 11, del: 2.3 },
    { x: "17%", size: 38, op: 0.65, dur: 8,  del: 4.7 },
    { x: "24%", size: 18, op: 0.35, dur: 13, del: 1.1 },
    { x: "31%", size: 26, op: 0.5,  dur: 10, del: 6.2 },
    { x: "38%", size: 34, op: 0.6,  dur: 7,  del: 3.4 },
    { x: "45%", size: 16, op: 0.4,  dur: 12, del: 8.1 },
    { x: "52%", size: 28, op: 0.55, dur: 9,  del: 0.6 },
    { x: "59%", size: 22, op: 0.45, dur: 11, del: 5.3 },
    { x: "66%", size: 40, op: 0.7,  dur: 8,  del: 2.8 },
    { x: "73%", size: 18, op: 0.4,  dur: 14, del: 7.5 },
    { x: "80%", size: 32, op: 0.6,  dur: 10, del: 1.9 },
    { x: "87%", size: 24, op: 0.5,  dur: 9,  del: 4.1 },
    { x: "93%", size: 20, op: 0.45, dur: 12, del: 6.8 },
    { x: "7%",  size: 36, op: 0.5,  dur: 11, del: 9.2 },
    { x: "20%", size: 22, op: 0.55, dur: 8,  del: 3.7 },
    { x: "42%", size: 16, op: 0.35, dur: 13, del: 7   },
    { x: "63%", size: 30, op: 0.6,  dur: 10, del: 0.3 },
    { x: "76%", size: 20, op: 0.45, dur: 9,  del: 5.6 },
    { x: "96%", size: 26, op: 0.5,  dur: 11, del: 2   },
  ];

  return (
    <section
      className="relative h-50 lg:h-82.5 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #162E28 0%, #1A3A34 45%, #1F4E46 100%)" }}
    >
      <style>{`
        @keyframes snlFall {
          0%   { transform: translateY(-50px) rotate(0deg);    opacity: 0; }
          8%   { opacity: var(--coin-op); }
          92%  { opacity: var(--coin-op); }
          100% { transform: translateY(380px) rotate(540deg); opacity: 0; }
        }
      `}</style>

      {coins.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: 0,
            width: c.size,
            height: c.size,
            "--coin-op": c.op,
            animation: `snlFall ${c.dur}s ${c.del}s linear infinite`,
          }}
        >
          <svg viewBox="0 0 40 40" width={c.size} height={c.size} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id={`rg${i}`} cx="36%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#F7DC78" />
                <stop offset="55%" stopColor="#E6B84C" />
                <stop offset="100%" stopColor="#B8882A" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="19" fill={`url(#rg${i})`} />
            <circle cx="20" cy="20" r="15.5" fill="none" stroke="#C99A2E" strokeWidth="1.2" opacity="0.6" />
            <text
              x="20" y="24"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fontFamily="Arial, sans-serif"
              fill="#7A5618"
              letterSpacing="0.8"
            >SNL</text>
          </svg>
        </div>
      ))}

      {/* Gradient de fondu en bas pour la transition vers le contenu */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #1A3A34)" }}
      />

      {/* Subtil reflet lumineux en haut */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(63,174,140,0.08), transparent)" }}
      />
    </section>
  );
}
