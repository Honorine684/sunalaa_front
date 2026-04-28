import Image from "next/image";

/**
 * SWatermark — S stylisé SUNALA (Group.png), réutilisable comme décoration de fond.
 * Props :
 *   size      — largeur en px (hauteur auto via l'aspect ratio de l'image)
 *   opacity   — opacité (défaut : 0.06)
 *   className — classes pour le positionnement (absolute, etc.)
 *   style     — styles inline supplémentaires
 */
export default function SWatermark({
  size = 480,
  opacity = 0.06,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`select-none pointer-events-none ${className}`}
      style={{ width: size, opacity, ...style }}
    >
      <Image
        src="/images/Group.png"
        alt=""
        width={306}
        height={400}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
