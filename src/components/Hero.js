"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { useAuth } from "@/context/AuthContext";
import { useLocale, useTranslations } from "next-intl";

export default function Hero({ compact = false }) {
  const t = useTranslations("Hero");
  const { user } = useAuth();
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] ${compact ? "min-h-0 lg:min-h-150" : "min-h-96 lg:min-h-150"}`}>
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

      <Container className={`relative z-10 text-center ${compact ? "pt-8 pb-10 lg:pt-36 lg:pb-28" : "pt-36 pb-28"}`}>
        {/* Titre — font-normal pas en gras */}
        <h1 className={`font-normal text-white leading-[1.15] mb-3 lg:mb-6 ${compact ? "text-[18px] lg:text-[58px]" : "text-[22px] lg:text-[58px]"}`}>
          {t("title_1")}
          <br />
          {t("title_2")}{" "}
          <span className="text-secondary font-normal">SUNALA</span>
        </h1>

        <p className={`text-white/70 leading-relaxed max-w-xl mx-auto whitespace-pre-line ${compact ? "text-[13px] mb-4 lg:text-[16px] lg:mb-10" : "text-[16px] mb-10"}`}>
          {t("subtitle")}
        </p>

        {!user && !compact && (
          <Link
            href={`${prefix}/register`}
            className="inline-flex items-center gap-3 bg-secondary text-white font-semibold text-[15px] px-8 py-4 rounded-full hover:brightness-110 transition"
          >
            {t("cta")}
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
        )}
      </Container>
    </section>
  );
}
