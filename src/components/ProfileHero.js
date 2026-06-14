import Image from "next/image";

export default function ProfileHero() {
  return (
    <section className="relative h-[330px] bg-[#1A3A34]">
      <Image
        src="/images/image_profil.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
        priority
      />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
    </section>
  );
}
