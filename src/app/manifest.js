export default function manifest() {
  return {
    name: "SUNALA — Points SNL",
    short_name: "SUNALA",
    description:
      "Collectez des points SNL chaque jour, parrainez vos proches et progressez ensemble.",
    start_url: "/",
    display: "standalone",
    background_color: "#1F4E46",
    theme_color: "#1F4E46",
    orientation: "portrait",
    categories: ["finance", "lifestyle"],
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
