"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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

        <Link href="/">
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
              <h1 className="text-white font-bold text-[24px] mb-2">Vérification en cours…</h1>
              <p className="text-white/60 text-[14px]">Veuillez patienter quelques secondes.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-[28px] mb-3">Email vérifié !</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">
                Votre compte est maintenant actif. Vous pouvez vous connecter et commencer à accumuler des points SNL.
              </p>
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl hover:brightness-90 transition">
                Se connecter
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
              <h1 className="text-white font-bold text-[28px] mb-3">Lien invalide ou expiré</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">
                Ce lien de vérification n&apos;est plus valide. Il a peut-être expiré ou déjà été utilisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register"
                  className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:brightness-90 transition">
                  Créer un nouveau compte
                </Link>
                <Link href="/login"
                  className="inline-flex items-center justify-center bg-white/10 text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-white/20 transition border border-white/20">
                  Se connecter
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
              <h1 className="text-white font-bold text-[28px] mb-3">Lien manquant</h1>
              <p className="text-white/70 text-[14px] leading-relaxed mb-8">
                Accédez à cette page depuis le lien reçu dans votre email de confirmation.
              </p>
              <Link href="/"
                className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-[14px] px-8 py-3 rounded-xl hover:brightness-90 transition">
                Retour à l&apos;accueil
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
