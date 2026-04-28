"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[640px] flex flex-col items-center gap-6">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo Sunaala.png"
            alt="SUNALA"
            width={130}
            height={34}
            className="object-contain"
            priority
          />
        </Link>

        {/* Card */}
        <div
          className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-[32px]"
          style={{ paddingTop: 70, paddingBottom: 70, paddingLeft: 91, paddingRight: 91 }}
        >
          {!sent ? (
            <>
              {/* Icône */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M2 8l10 6 10-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center mb-2" style={{ fontSize: 38, fontWeight: 700, lineHeight: "100%", color: "#FFFFFF" }}>
                Mot de passe oublié ?
              </h1>

              {/* Description */}
              <p className="text-center mb-8" style={{ fontSize: 16, fontWeight: 400, lineHeight: "150%", color: "rgba(255,255,255,0.6)" }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {/* Form */}
              <form className="flex flex-col gap-[26px]" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 18, fontWeight: 400, lineHeight: "100%", color: "#FFFFFF" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="username@gmail.com"
                    className="w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] placeholder:text-[14px] placeholder:font-normal outline-none focus:ring-2 focus:ring-secondary/50 transition"
                    style={{ height: 50, borderRadius: 10, border: "1px solid #BCBEC0", paddingTop: 17, paddingBottom: 17, paddingLeft: 23, paddingRight: 23 }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition cursor-pointer"
                >
                  Envoyer le lien
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Succès */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-center mb-2" style={{ fontSize: 38, fontWeight: 700, lineHeight: "100%", color: "#FFFFFF" }}>
                Email envoyé !
              </h1>
              <p className="text-center mt-3" style={{ fontSize: 16, fontWeight: 400, lineHeight: "150%", color: "rgba(255,255,255,0.6)" }}>
                Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
              </p>
            </>
          )}

          {/* Retour au login */}
          <p className="text-center mt-8" style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>
            <Link href="/login" className="text-white font-semibold hover:text-secondary transition-colors flex items-center justify-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour à la connexion
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
