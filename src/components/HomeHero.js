"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "./Container";
import CollecteModal from "./CollecteModal";

export default function HomeHero({ onCollected }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] min-h-105 lg:min-h-160">
        {/* Background */}
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

        <Container className="relative z-10 text-center pt-16 pb-20">
          <h1 className="text-[32px] lg:text-[58px] font-bold text-white leading-[1.15] mb-8">
            Welcome to the
            <br />
            <span className="text-secondary font-bold">SUNALA</span> community
          </h1>

          <p className="text-[16px] mb-0 max-w-xl mx-auto" style={{ color: "#EDECED", lineHeight: "28px", letterSpacing: "0.01em" }}>
            Every day, your engagement brings you closer to more rewards.
            <br />
            Keep collecting, progressing and growing with the community.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center rounded-full hover:brightness-110 transition mt-12 bg-secondary text-white font-semibold text-[15px] cursor-pointer"
            style={{ height: 64, paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 16, gap: 24, borderRadius: 32 }}
          >
            Collect
            <span className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#1F4E46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </Container>
      </section>

      {showModal && <CollecteModal onClose={() => setShowModal(false)} onCollected={onCollected} />}
    </>
  );
}
