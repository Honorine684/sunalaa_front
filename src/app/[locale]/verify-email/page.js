"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { authApi } from "@/lib/api";

const TEXT = {
  en: {
    loading_title: "Verifying your email…",
    loading_desc:  "Please wait a few seconds.",
    success_title: "Email verified!",
    success_desc:  "Your account is now active. You can log in and start earning SNL points.",
    success_cta:   "Log in",
    error_title:   "Invalid or expired link",
    error_desc:    "This verification link is no longer valid. It may have expired or already been used.",
    error_register:"Create a new account",
    error_login:   "Log in",
    notoken_title: "Missing link",
    notoken_desc:  "Access this page from the link received in your confirmation email.",
    notoken_cta:   "Back to home",
  },
  fr: {
    loading_title: "Vérification en cours…",
    loading_desc:  "Veuillez patienter quelques secondes.",
    success_title: "Email vérifié !",
    success_desc:  "Votre compte est maintenant actif. Vous pouvez vous connecter et commencer à accumuler des points SNL.",
    success_cta:   "Se connecter",
    error_title:   "Lien invalide ou expiré",
    error_desc:    "Ce lien de vérification n'est plus valide. Il a peut-être expiré ou déjà été utilisé.",
    error_register:"Créer un nouveau compte",
    error_login:   "Se connecter",
    notoken_title: "Lien manquant",
    notoken_desc:  "Accédez à cette page depuis le lien reçu dans votre email de confirmation.",
    notoken_cta:   "Retour à l'accueil",
  },
};

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.en;
  const prefix = locale === "fr" ? "/fr" : "";

  const [status, setStatus] = useState("loading"); // loading | success | error | no-token

  useEffect(() => {
    if (!token) { setStatus("no-token"); return; }
    authApi.verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-160 flex flex-col items-center gap-6">

        <Link href={`${prefix}/`}>
          <Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority />
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-4xl px-8 py-16 text-center">

          {status === "loading" && (
            <>
              <div className="flex justify-center mb-6">
                <svg className="animate-spin w-12 h-12 text-secondary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-[24px] mb-2">{t.loading_title}</h1>
              <p className="text-white/60 text-[14px]">{t.loading_desc}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-[28px] mb-3">{t.success_title}</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">{t.success_desc}</p>
              <Link
                href={`${prefix}/login`}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl hover:brightness-90 transition"
              >
                {t.success_cta}
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-[28px] mb-3">{t.error_title}</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">{t.error_desc}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`${prefix}/register`}
                  className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:brightness-90 transition"
                >
                  {t.error_register}
                </Link>
                <Link
                  href={`${prefix}/login`}
                  className="inline-flex items-center justify-center bg-white/10 text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-white/20 transition border border-white/20"
                >
                  {t.error_login}
                </Link>
              </div>
            </>
          )}

          {status === "no-token" && (
            <>
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-[28px] mb-3">{t.notoken_title}</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">{t.notoken_desc}</p>
              <Link
                href={`${prefix}/`}
                className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-[14px] px-8 py-3 rounded-xl hover:brightness-90 transition"
              >
                {t.notoken_cta}
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}
