const API = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  try {
    const res = await fetch(`${API}/products/${id}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    const p = json?.data ?? json;
    const title = p?.name ?? "Formation";
    const description =
      p?.description ?? p?.shortDesc ?? "Apprenez la crypto et gagnez des SNL sur SUNALA.";
    const image = p?.images?.[0]
      ? p.images[0].startsWith("http")
        ? p.images[0]
        : `https://api.sunalaa.com${p.images[0]}`
      : "/images/sunala_LOGO.png";
    const canonical = locale === "fr"
      ? `https://sunalaa.com/fr/formations/${id}`
      : `https://sunalaa.com/formations/${id}`;
    return {
      title,
      description,
      alternates: {
        canonical,
        languages: {
          "x-default": `https://sunalaa.com/formations/${id}`,
          en: `https://sunalaa.com/formations/${id}`,
          fr: `https://sunalaa.com/fr/formations/${id}`,
        },
      },
      openGraph: {
        title: `${title} | SUNALA`,
        description,
        url: canonical,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | SUNALA`,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "Formation | SUNALA" };
  }
}

export default function FormationLayout({ children }) {
  return children;
}
