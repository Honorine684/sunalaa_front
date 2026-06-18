"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  const href = !user
    ? "/login"
    : user.role?.toLowerCase() === "admin"
      ? "/admin"
      : "/collecter";
  return (
    <section className="relative min-h-96 lg:min-h-150 flex items-center justify-center overflow-hidden bg-[#0d2e2a]">
      {/* Background coin */}
      <div className="absolute inset-0">
        <Image
          src="/images/image 2.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2e2a]/85 via-[#1F4E46]/65 to-[#0d2e2a]/95" />
      </div>

      <Container className="relative z-10 text-center pt-36 pb-28">
        {/* Titre — font-normal pas en gras */}
        <h1 className="text-[32px] lg:text-[58px] font-normal text-white leading-[1.15] mb-6">
          Fastest &amp; secure platform
          <br />
          to invest in{" "}
          <span className="text-secondary font-normal">SUNALA</span>
        </h1>

        <p className="text-white/70 text-[16px] leading-relaxed mb-10 max-w-xl mx-auto">
          Accumulate SNL points through your daily activity
          <br />
          and prepare for the arrival of the community token
        </p>

        <Link
          href={href}
          className="inline-flex items-center gap-3 bg-secondary text-white font-semibold text-[15px] px-8 py-4 rounded-full hover:brightness-110 transition"
        >
          Try for FREE
          {/* Cercle blanc avec flèche droite sombre */}
          <span className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="#3FAE8C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </Container>
    </section>
  );
}
