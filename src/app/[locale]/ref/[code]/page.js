import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return {
    title: "Rejoindre SUNALA",
    description: `Vous avez été invité à rejoindre SUNALA. Inscrivez-vous avec le code ${code} et gagnez 500 SNL de bonus dès votre inscription.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: "Rejoindre SUNALA — 500 SNL offerts",
      description: `Inscription avec parrainage — collectez des points SNL chaque jour et progressez avec la communauté.`,
      images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Rejoindre SUNALA — 500 SNL offerts",
      description: "Inscription avec parrainage — collectez des points SNL chaque jour.",
      images: ["/images/sunala_LOGO.png"],
    },
  };
}

export default async function RefPage({ params }) {
  const { code } = await params;
  redirect(`/register?ref=${code}`);
}
