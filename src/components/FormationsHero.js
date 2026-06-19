import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function FormationsHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] min-h-120 lg:min-h-180">
      {/* Background — same as /collecter */}
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

      {/* Content */}
      <Container className="relative z-10 text-center pt-16 pb-20">
        <h1 className="text-[22px] lg:text-[64px] font-bold text-white mb-4 lg:mb-6" style={{ fontFamily: "Rubik, sans-serif", fontWeight: 700, lineHeight: "100%", letterSpacing: "0%" }}>
          Courses &amp; Masterclass on
          <br />
          <span className="text-secondary font-bold">Cryptocurrencies</span>
        </h1>

        <p className="text-[16px] mb-10 max-w-xl mx-auto" style={{ fontFamily: "Rubik, sans-serif", fontWeight: 400, lineHeight: "28px", letterSpacing: "1%", color: "#EDECED" }}>
          Accumulate SNL points through your daily activity and prepare
          <br />
          for the arrival of the community token
        </p>

        <Link
          href="#formations"
          className="inline-flex items-center bg-secondary text-white hover:brightness-110 transition"
          style={{ height: 44, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 14, gap: 14, borderRadius: 32, fontSize: 15, fontWeight: 500, lineHeight: "150%" }}
        >
          Start a course
          <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#1F4E46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>
      </Container>
    </section>
  );
}
