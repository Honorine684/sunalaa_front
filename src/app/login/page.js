"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ─── Reusable Input ─────────────────────────────────────────────── */
function Input({ label, type = "text", placeholder, name, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 18, fontWeight: 400, lineHeight: "100%", color: "#FFFFFF" }}>{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] placeholder:text-[14px] placeholder:font-normal outline-none focus:ring-2 focus:ring-secondary/50 transition"
          style={{ height: 50, borderRadius: 10, border: "1px solid #BCBEC0", paddingTop: 17, paddingBottom: 17, paddingLeft: 23, paddingRight: 23 }}
        />
        {children}
      </div>
    </div>
  );
}

/* ─── Social Button ──────────────────────────────────────────────── */
function SocialButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex-1 flex items-center justify-center py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A4338] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[640px] flex flex-col items-center gap-6">

        {/* Logo — au-dessus de la card */}
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
        <div className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-[32px]" style={{ paddingTop: 70, paddingBottom: 70, paddingLeft: 91, paddingRight: 91 }}>

        {/* Title */}
        <h1 className="text-white mb-7" style={{ fontSize: 38, fontWeight: 700, lineHeight: "100%", color: "#FFFFFF" }}>Login</h1>

        <form className="flex flex-col gap-[26px]">
          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="username@gmail.com"
          />

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 18, fontWeight: 400, lineHeight: "100%", color: "#FFFFFF" }}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] placeholder:text-[14px] placeholder:font-normal outline-none focus:ring-2 focus:ring-secondary/50 transition"
                style={{ height: 50, borderRadius: 10, border: "1px solid #BCBEC0", paddingTop: 17, paddingBottom: 17, paddingLeft: 23, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Afficher/Masquer le mot de passe"
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            {/* Forgot password */}
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-white/50 text-[12px] hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition cursor-pointer mt-1"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-[13px]">continuer avec</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3">
          <SocialButton label="Google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </SocialButton>

          <SocialButton label="Github">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#24292e">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </SocialButton>

          <SocialButton label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </SocialButton>
        </div>

        {/* Bottom link */}
        <p className="text-center text-white/60 text-[13px] mt-6">
          Pas de compte ?{" "}
          <Link
            href="/register"
            className="text-white underline underline-offset-2 hover:text-secondary transition-colors"
          >
            s&apos;inscrire
          </Link>
        </p>
        </div> {/* fin card */}
      </div>
    </div>
  );
}
