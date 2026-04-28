export default function ProfileAbout() {
  const info = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      value: "Male",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      value: "2239 Hog Camp Road Schaumburg",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      value: "charles5182@ummoh.com",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: "33757005467",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="mb-5" style={{ fontSize: 20, fontWeight: 700, lineHeight: "100%", color: "#0F172B" }}>
        A PROPOS
      </h3>
      <div className="flex flex-col gap-4">
        {info.map((item, i) => (
          <div key={i} className="flex items-start gap-3" style={{ fontSize: 16, fontWeight: 500, lineHeight: "100%", color: "#64748B" }}>
            <span className="shrink-0" style={{ width: 16, height: 16, marginLeft: 4, marginRight: 4 }}>{item.icon}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
