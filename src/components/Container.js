export default function Container({ children, className = "" }) {
  return (
    <div className={`max-w-[1280px] mx-auto px-6 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
