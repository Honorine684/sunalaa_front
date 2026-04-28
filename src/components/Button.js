import Link from "next/link";

export default function Button({ children, href, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center gap-3 font-semibold rounded-full transition cursor-pointer";

  const variants = {
    primary: "bg-secondary text-white hover:brightness-110 px-8 py-4 text-[15px]",
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-2.5 text-sm",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
