const API = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

export async function generateMetadata({ params }) {
  const { id } = await params;
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
    return {
      title,
      description,
      openGraph: {
        title: `${title} | SUNALA`,
        description,
        images: [{ url: image, width: 800, height: 600, alt: title }],
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
