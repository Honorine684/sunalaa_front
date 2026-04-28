import Container from "./Container";
import FilterTabs from "./FilterTabs";
import LeaderboardTable from "./LeaderboardTable";

export default function LeaderboardSection() {
  return (
    <section className="bg-white py-16 relative overflow-hidden">
      {/* S watermark */}
      <img
        src="/images/mode.png"
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 280,
          height: 320,
          objectFit: "fill",
          opacity: 0.4,
          left: -10,
          top: "14%",
          filter: "grayscale(1) brightness(0)",
          zIndex: 0,
        }}
      />

      {/* S watermark bas gauche */}
      <img
        src="/images/mode.png"
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 280,
          height: 320,
          objectFit: "fill",
          opacity: 0.4,
          left: -10,
          bottom: "2%",
          filter: "grayscale(1) brightness(0)",
          zIndex: 0,
        }}
      />

      {/* S watermark droite */}
      <img
        src="/images/mode.png"
        alt=""
        aria-hidden="true"
        className="absolute select-none pointer-events-none"
        style={{
          width: 420,
          height: 420,
          objectFit: "fill",
          opacity: 0.4,
          right: -60,
          top: "30%",
          filter: "grayscale(1) brightness(0)",
          zIndex: 0,
        }}
      />

      <Container className="relative z-10 space-y-6">
        <FilterTabs />
        <LeaderboardTable />
      </Container>
    </section>
  );
}
