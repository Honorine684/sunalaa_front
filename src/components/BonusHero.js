import Image from "next/image";
import Container from "./Container";

const streakDays = [
  { day: 1, label: "Aujourd'hui", snl: 10 },
  { day: 2, label: "2 jours",     snl: 20 },
  { day: 3, label: "3 jours",     snl: 30 },
  { day: 4, label: "4 jours",     snl: 40 },
  { day: 5, label: "5 jours",     snl: 50 },
  { day: 6, label: "6 jours",     snl: 70 },
  { day: 7, label: "7 jours",     snl: 80 },
];

export default function BonusHero() {
  /* Day 1 = today (already claimed in the maquette) */
  const todayDay = 1;

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a]" style={{ minHeight: 720 }}>
      {/* Background — same as /collecter & /formations */}
      <div className="absolute inset-0">
        <Image
          src="/images/image 2.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
      </div>

      <Container className="relative z-10 pt-36 pb-20 text-center">
        {/* Title */}
        <h1 className="text-white text-[32px] lg:text-[64px] font-bold leading-none mb-12" style={{ fontFamily: "Rubik, sans-serif", letterSpacing: 0 }}>
          Gagnez jusqu&apos;à{" "}
          <span style={{ color: "#3FAE8C" }}>500 SNL</span>
          <br />
          de bonus
        </h1>

        {/* Streak cards */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {streakDays.map(({ day, label, snl }) => {
            const isToday = day === todayDay;

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                {/* Card */}
                <div
                  className={[
                    "flex flex-col items-center justify-center gap-2 w-[100px] py-5 rounded-2xl transition-all duration-200 border-2 border-white",
                    isToday
                      ? "bg-[#E6B84C] shadow-[0_4px_20px_rgba(230,184,76,0.4)]"
                      : "bg-[#0d1f1c] hover:scale-[1.02]",
                  ].join(" ")}
                >
                  <div className={`relative ${isToday ? "w-14 h-14" : "w-12 h-12"}`}>
                    <Image src="/images/4.png" alt="coins" fill className="object-contain" />
                  </div>
                  <span
                    className={[
                      "text-[22px] font-bold leading-none",
                      isToday ? "text-white" : "text-white",
                    ].join(" ")}
                  >
                    {snl}
                  </span>
                </div>

                {/* Day label below card */}
                <span className="text-white text-[16px] font-normal leading-[150%]">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Claim button */}
        <div className="flex justify-center mt-10">
          <button className="bg-[#E6B84C] text-white font-bold text-[16px] px-16 py-5 rounded-4xl hover:brightness-110 transition cursor-pointer shadow-lg">
            Réclamé
          </button>
        </div>
      </Container>
    </section>
  );
}
