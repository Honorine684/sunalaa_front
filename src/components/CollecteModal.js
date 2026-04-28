"use client";

export default function CollecteModal({ onClose }) {
  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="flex flex-col items-center relative w-[90vw] sm:w-118.5 mx-4"
        style={{
          maxWidth: 474,
          borderRadius: 40,
          padding: 20,
          gap: 20,
          backgroundColor: "#1F4E46",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00BC7D, #00BBA7)",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z"
              fill="white"
            />
          </svg>
        </div>

        {/* Texts */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-white font-bold text-[22px] leading-snug">
            Collecte quotidienne
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Votre récompense du jour est prête à être réclamée
          </p>
        </div>

        {/* Reward card */}
        <div
          className="w-full flex flex-col gap-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "16px 20px",
          }}
        >
          {/* Total */}
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#E5B858" />
              <path d="M12 6l1.5 4H18l-3.5 2.5 1.5 4L12 14l-4 2.5 1.5-4L6 10h4.5L12 6z" fill="white" />
            </svg>
            <span className="font-black text-[28px] text-white leading-none">10</span>
            <span className="font-bold text-[16px]" style={{ color: "rgba(255,255,255,0.60)" }}>SNL</span>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />

          {/* Breakdown */}
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "rgba(255,255,255,0.60)" }}>Récompense de base</span>
            <span className="text-white font-semibold">15 SNL</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "rgba(255,255,255,0.60)" }}>Bonus fidélité (12 jours)</span>
            <span className="font-semibold" style={{ color: "#3FAE8C" }}>+5 SNL</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full flex items-center justify-center gap-3 font-bold text-[16px] text-white cursor-pointer transition-opacity hover:opacity-90"
          style={{
            height: 68,
            borderRadius: 14,
            background: "linear-gradient(135deg, #009966, #009689)",
            boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
            border: "none",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z"
              fill="white"
            />
          </svg>
          Collecter maintenant
        </button>

        {/* Footer note */}
        <p className="text-center text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Revenez chaque jour pour maintenir votre série et augmenter vos bonus
        </p>
      </div>
    </div>
  );
}
