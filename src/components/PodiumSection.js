import Container from "./Container";
import PodiumItem from "./PodiumItem";

const podiumData = [
  { rank: 2, username: "legend", score: "6.810" },
  { rank: 1, username: "whale_king", score: "7.810" },
  { rank: 3, username: "moon_master", score: "5.810" },
];

export default function PodiumSection() {
  return (
    <section className="relative bg-white pt-24 pb-8 overflow-hidden">
      {/* Cercles déco gauche */}
      <div className="absolute top-[45%] -translate-y-1/2 pointer-events-none hidden lg:block" style={{ left: 188 }}>
        {[338, 260, 180, 100].map((size) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              border: "1px solid rgba(32,180,134,0.25)",
            }}
          />
        ))}
      </div>

      {/* Cercles déco droite — miroir */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" style={{ right: 169 }}>
        {[338, 260, 180, 100].map((size) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              border: "1px solid rgba(32,180,134,0.25)",
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <div
          className="max-w-216 mx-auto bg-white rounded-2xl border flex flex-col"
          style={{
            borderColor: "#E2E8F0",
            paddingTop: 25,
            paddingRight: 25,
            paddingBottom: 1,
            paddingLeft: 25,
            gap: 24,
            minHeight: 266,
          }}
        >
          <h2 className="text-[15px] lg:text-[17px] font-normal text-gray-800 text-center">
            Podium
          </h2>

          <div className="flex items-end justify-between">
            {podiumData.map((item) => (
              <PodiumItem
                key={item.rank}
                rank={item.rank}
                username={item.username}
                score={item.score}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
