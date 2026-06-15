import Image from "next/image";

export const metadata = {
  title: "Maintenance en cours",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d2e2a] px-6 text-center">
      <div className="mb-8">
        <Image src="/images/logo Sunaala.png" alt="SUNALA" width={120} height={120} className="mx-auto" />
      </div>

      <div className="mb-6">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-secondary">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="#3FAE8C" strokeWidth="1.5"/>
          <path d="M12 7v5l3 3" stroke="#3FAE8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-[28px] lg:text-[40px] font-bold text-white mb-3">
          Maintenance en cours
        </h1>
        <p className="text-white/60 text-[16px] max-w-md mx-auto leading-relaxed">
          La plateforme SUNALA est temporairement indisponible pour une mise à jour.
          Nous serons de retour très bientôt.
        </p>
      </div>

      <div className="bg-white/10 rounded-2xl px-6 py-4 max-w-sm w-full mb-6">
        <p className="text-white/80 text-[14px]">
          Merci de votre patience. Vos points SNL sont en sécurité.
        </p>
      </div>

      <a
        href="/"
        className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-[15px] px-8 py-4 rounded-full hover:brightness-110 transition"
      >
        Réessayer
      </a>
    </div>
  );
}
