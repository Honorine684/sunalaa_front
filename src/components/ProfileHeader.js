import Container from "./Container";

export default function ProfileHeader() {
  return (
    <div className="bg-white border-b border-slate-100">
      <Container>
        <div className="flex flex-wrap items-end gap-5 py-8">

          {/* Avatar — overlaps the hero with negative margin */}
          <div className="w-[180px] h-[180px] -mt-[125px] ml-8 rounded-full bg-[#FBB03B] flex items-center justify-center text-white text-[48px] font-bold shrink-0 relative z-10"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            SC
          </div>

          {/* Name + handle */}
          <div className="mb-[-18px]">
            <h1 className="text-[22px] lg:text-[30px]" style={{ fontWeight: 700, lineHeight: "100%", color: "#0F172B" }}>Charles Deo</h1>
            <p className="mt-2" style={{ fontSize: 16, fontWeight: 400, lineHeight: "100%", color: "#94A3B8" }}>@bobmark</p>
          </div>

          {/* Badges — pushed to the right */}
          <div className="ml-auto flex items-center gap-3 flex-wrap">
            {/* Trophy circle */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1A3A34" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 21h8m-4-4v4m0-4c-4.418 0-8-3.582-8-8V5h16v4c0 4.418-3.582 8-8 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9H2a1 1 0 01-1-1V7a1 1 0 011-1h2M20 9h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Niveau Silver */}
            <div className="bg-[#1A3A34] text-white text-[14px] font-normal px-5 py-2.5 rounded-xl shrink-0">
              Niveau Silver
            </div>

            {/* SNL balance */}
            <div className="border-2 border-slate-200 text-slate-800 text-[14px] font-bold px-5 py-2.5 rounded-xl shrink-0">
              12,500 SNL
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
