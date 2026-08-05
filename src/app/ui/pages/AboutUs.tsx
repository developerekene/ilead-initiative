import React from "react";

import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  // Analytical timeline metrics mapping out iLead's core evolutionary benchmarks
  const historyTimeline = [
    {
      year: "March 2026",
      title: "The Genesis",
      description:
        "iLead was intentionally founded by Ekene and co-founder Promise with a bold operational mandate: to spread an empowering tech ideology, fight professional isolation, and help individuals live purposeful, unblocked lives using digital tools.",
    },
    {
      year: "Spring 2026",
      title: "Ecosystem Expansion",
      description:
        "Launched targeted community initiatives, including structural mentorship pairing frameworks and peer-backed crowd-funding resources like the Equipment Fund to unlock technical access barriers.",
    },
    {
      year: "June 2026",
      title: "Local & Regional Outreaches",
      description:
        "Initiated deep offline-to-online regional campaigns—deploying clean, informative physical and digital assets across business sectors to bridge local commerce with automated AI systems.",
    },
  ];

  // Core Value Pillars
  const valuePillars = [
    {
      title: "Radical Inclusivity",
      desc: "Building support frameworks like our Disability Panels and cross-regional mentorship tiers so nobody is locked out of global talent workspaces.",
      icon: "🌱",
    },
    {
      title: "Practical Application",
      desc: "Rejecting abstract fluff in favor of rigorous, career-focused skill blocks tailored around actual macroeconomic needs.",
      icon: "⚙️",
    },
    {
      title: "Human Validation",
      desc: "Providing active peer safety nets, direct code reviews, and physical resources to combat developer and creator burnout.",
      icon: "🤝",
    },
  ];

  const leaders = [
    {
      fullName: "Ekenedilichukwu Okoli",
      initials: "EO",
      role: "Founder & Lead Technical Assiociate",
      status: "Active Matrix Leader",
      imageSrc:
        "https://media.licdn.com/dms/image/v2/D4E03AQHiqi4YHQpQLA/profile-displayphoto-crop_800_800/B4EZywxwZxGYAM-/0/1772492361198?e=1784160000&v=beta&t=xG4teEQN6mBQAZ91E7HKJc92iOZD9XNdCV0caNk4dAI", // Add path to your profile image asset here (e.g., "/images/ekene.jpg")
      linkedInUrl:
        "https://www.linkedin.com/in/ekenedilichukwu-okoli-7615591b5",
      statement:
        "True digital empowerment isn't about teaching abstract theories or building for flashy aesthetics. It's about dismantling systemic access blocks. I engineered iLead to function as a highly practical human accelerator—equipping developers and creators with the rugged, real-world engineering architecture required to scale globally and build sustainable operational autonomy.",
    },
    {
      fullName: "Promise Joshua",
      initials: "PJ",
      role: "Co-Founder & Lead Operations Assiociate",
      status: "Active Operations Leader",
      imageSrc:
        "https://media.licdn.com/dms/image/v2/D4D03AQHoyIkk-1S0vA/profile-displayphoto-crop_800_800/B4DZy92UwRH4AI-/0/1772711663085?e=1784160000&v=beta&t=A01r2VZSixEYaaJ3KMzkE5nTkfv2CL_eBXCONtlLD0k", // Add path to your profile image asset here
      linkedInUrl: "https://www.linkedin.com/in/promise-joshua-980b79363",
      statement:
        "Community isn't just a collective grouping of people; it is an economic and collaborative engine. My mandate within iLead is to build resilient, hyper-functional connective tissue between emerging talent, cross-regional mentorship tiers, and crucial funding pools like the Equipment Fund. We ensure no brilliant mind remains locked behind infrastructural barriers.",
    },
  ];

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* SECTION 1: THE HERO STRATEGIC INTENT DECLARATION */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              Who We Are
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Empowering global talent through technology, action, and access.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
              iLead is a coordinated human engine designed to spread tech
              ideology and elevate professional vectors. We operate across three
              distinct tracks: Tech Mentorship, Business Strategy, and Community
              Giving.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURAL VALUE PILLARS */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Core Philosophy
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Principles That Fuel Our Blueprint
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            We do not design futuristic, abstract concepts. We build clean,
            high-utility frameworks that deliver direct economic and educational
            solutions.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {valuePillars.map((pillar, index) => (
            <div
              key={index}
              className={`bg-slate-50 border border-purple-950/[0.02] p-6 sm:p-8 rounded-2xl space-y-3 hover:bg-white hover:shadow-md transition-all duration-300 ${
                index === 2 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="w-10 h-10 bg-white border border-purple-950/5 rounded-xl flex items-center justify-center text-lg shadow-sm">
                {pillar.icon}
              </div>
              <h4 className="text-base font-black tracking-tight text-purple-950">
                {pillar.title}
              </h4>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: THE FOUNDATIONAL INTENT TIMELINE */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Our Evolution
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              How iLead Tracks Forward
            </h2>
          </div>

          <div className="relative border-l border-white/10 pl-6 sm:pl-10 ml-2 sm:ml-6 space-y-12">
            {historyTimeline.map((item, i) => (
              <div key={i} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-purple-950 shadow-sm transition-transform duration-200 group-hover:scale-125" />

                <div className="space-y-1">
                  <span className="text-xs font-black text-orange-400 tracking-wider font-mono">
                    {item.year}
                  </span>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed max-w-2xl pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CO-FOUNDATION DIRECTORY METRIC CAPTURE */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16">
        {/* SECTION HEADER */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
            Leadership Mandate
          </span>
          <h3 className="text-3xl font-black tracking-tight text-purple-950 pt-2">
            Coordinated Management
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            iLead is systematically anchored by active engineering leaders and
            strategic partners dedicated to expanding global digital talent
            infrastructure.
          </p>
        </div>

        {/* LEADERS GRID */}
        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-slate-50/40 border border-purple-950/[0.03] rounded-3xl p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
            >
              {/* Ambient subtle accent card corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-950/[0.01] rounded-bl-full pointer-events-none" />

              {/* LEFT PROFILE BLOCKS: IDENTIFICATION & METRICS (md:col-span-4) */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                {/* IMAGE HOUSING CONTAINER */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-purple-950 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-md border border-purple-950/10 overflow-hidden relative group shrink-0">
                  {leader.imageSrc ? (
                    <img
                      src={leader.imageSrc}
                      alt={leader.fullName}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span>{leader.initials}</span>
                  )}
                </div>

                {/* DETAILS AND STATUS PILL */}
                <div className="space-y-2 w-full">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-wider uppercase text-emerald-700">
                      {leader.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black tracking-tight text-purple-950 leading-tight">
                      {leader.fullName}
                    </h4>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mt-1">
                      {leader.role}
                    </p>
                  </div>
                </div>

                {/* LINKEDIN BUTTON INTERACTION */}
                <a
                  href={leader.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-purple-950 border border-purple-950/10 hover:border-purple-950 text-purple-950 hover:text-white font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-purple-950/[0.02]"
                >
                  <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>

              {/* RIGHT PROFILE BLOCKS: DEEP STATEMENT (md:col-span-8) */}
              <div className="md:col-span-8 h-full flex flex-col justify-between border-t md:border-t-0 md:border-l border-purple-950/5 pt-6 md:pt-2 md:pl-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-purple-950/30 uppercase tracking-widest block">
                    Personal Intent & Vision
                  </span>
                  <p className="text-xs sm:text-sm text-purple-950/80 font-medium leading-relaxed tracking-normal italic relative">
                    "{leader.statement}"
                  </p>
                </div>

                {/* Secondary architectural detail label */}
                <div className="pt-6 mt-6 border-t border-purple-950/[0.03] flex items-center justify-between text-[11px] font-bold text-purple-950/40">
                  <span>Core Pillar Focus: Track Alpha</span>
                  <span>iLead Global Architecture</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VISION & MISSION DUAL-CORE BLOCK */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* MISSION TRACK */}
          <div className="bg-slate-50/50 border border-purple-950/[0.02] p-8 md:p-10 rounded-[2rem] flex flex-col justify-between space-y-6 hover:bg-white hover:shadow-sm transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-950 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm select-none">
                  M
                </span>
                <span className="text-xs font-black tracking-widest uppercase text-purple-950/40">
                  Our Operational Mandate
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-purple-950">
                The Mission
              </h3>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                To aggressively lower the barrier to technological excellence by
                providing localized, high-impact learning frameworks, structured
                professional mentorship layers, and active funding
                assets—equipping individuals to overcome workspace roadblocks
                and live purposeful, unblocked lives.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-950/[0.04] text-[10px] font-black uppercase text-orange-500 tracking-wider">
              → Grounded in execution & community action
            </div>
          </div>

          {/* VISION TRACK */}
          <div className="bg-purple-950 text-white p-8 md:p-10 rounded-[2rem] flex flex-col justify-between space-y-6 shadow-xl shadow-purple-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12 pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm select-none">
                  V
                </span>
                <span className="text-xs font-black tracking-widest uppercase text-white/40">
                  Our Long-Range Horizon
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                The Vision
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                To anchor a resilient, self-sustaining global talent network
                where structural inequalities are bypassed through open digital
                integration—positioning creators, engineers, and local
                businesses to lead regional technology ecosystems autonomously.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-[10px] font-black uppercase text-orange-400 tracking-wider">
              → Scaling borderless human capability
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: OPERATIONAL CORE TRACKS */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                Ecosystem Footprint
              </span>
              <h3 className="text-3xl font-black tracking-tight text-purple-950 pt-2">
                Multi-Sector Integration
              </h3>
            </div>
            <div className="lg:col-span-7">
              <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed">
                iLead does not limit technological progress to code bases. We
                deploy specialized workflow frameworks across critical local
                commerce sectors to systematically scale visibility and
                operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                track: "01 / Tech & Systems",
                label: "Software Architecture",
                desc: "Rigorous focus on modern mobile development architectures, engineering team leadership templates, typescript validation layers, and automated custom AI business logic workflows.",
              },
              {
                track: "02 / Scalable Enterprise",
                label: "Food, Fashion & Retail",
                desc: "Grounding creative creators, local culinary entrepreneurs, and designers in defensible unit economics, supply operational overhead diagnostics, and brand positioning.",
              },
              {
                track: "03 / Capital & Workspace",
                label: "Ecosystem Entrepreneurship",
                desc: "Bypassing hardware limits via crowd-fueled financing, structuring digital talent mentorship modules, and forming remote team placement pipelines for global impact.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-purple-950/[0.02] rounded-2xl p-6 sm:p-8 space-y-4 hover:bg-white hover:shadow-sm transition-all duration-300"
              >
                <div className="text-[11px] font-mono font-black text-orange-500 tracking-wider">
                  {item.track}
                </div>
                <h4 className="text-lg font-black tracking-tight text-purple-950">
                  {item.label}
                </h4>
                <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION BANNER */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="bg-orange-50/60 border border-orange-200/50 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl transform -translate-x-6 translate-y-6 pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              Ready to belong to a global network of opportunities?
            </h3>
            <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
              Whether you want to solve core educational challenges, explore
              mentorship assets, or back an equipment fund, your place in our
              community directory awaits.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/all-Campaign"
              type="button"
              className="bg-purple-950 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all cursor-pointer"
            >
              Explore Active Workflows
            </a>
          </div>
        </div>
      </section>

      {/* SECTION: ECOSYSTEM IMPACT LEDGER */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-black text-purple-950/40 uppercase tracking-widest block">
              Verifiable Audits
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950 leading-tight">
              The Network Metric Index
            </h3>
            <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed">
              We track operational output dynamically. Our milestones represent
              real systems distributed, hours invested, and unblocked talent
              tracks.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {[
              {
                value: "850+",
                unit: "Active Peers Connected",
                detail: "Breaking isolated engineering blocks",
              },
              {
                value: "450+",
                unit: "Mentorship Hours Gifted",
                detail: "Senior technical leadership syncs",
              },
              {
                value: "84",
                unit: "Laptops Provided",
                detail: "Zero-interest hardware assets",
              },
              {
                value: "100%",
                unit: "Community Backed",
                detail: "No hidden micro-financing tiers",
              },
              {
                value: "24/7",
                unit: "Technical SOS Channel",
                detail: "Live codebase review instances",
              },
              {
                value: "3 Tiers",
                unit: "Cohort Management",
                detail: "From basic tracks to high acceleration",
              },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="bg-slate-50/50 border border-purple-950/[0.01] p-5 rounded-2xl space-y-1 hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight font-mono">
                  {metric.value}
                </div>
                <div className="text-xs font-black text-orange-500 uppercase tracking-wide leading-tight">
                  {metric.unit}
                </div>
                <p className="text-[10px] text-purple-950/40 font-semibold pt-1 leading-normal">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: THREE-TIER MENTORSHIP BLUEPRINT */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40">
              Structured Paths
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950">
              Cohort Mentorship Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
            {[
              {
                tier: "Tier 01",
                name: "Foundational Code Track",
                intent: "For emerging talent entering complex environments.",
                focus: [
                  "Unblocking core typescript logic",
                  "Git workflow architecture essentials",
                  "Basic UI layout system engineering",
                ],
              },
              {
                tier: "Tier 02",
                name: "Career Acceleration Matrix",
                intent:
                  "Mid-level practitioners targeting senior ownership roles.",
                focus: [
                  "Cross-platform mobile engineering",
                  "Firebase & Data integration hooks",
                  "Remote team management principles",
                ],
              },
              {
                tier: "Tier 03",
                name: "Strategic Founders Sprint",
                intent:
                  "Technical leaders scaling physical & digital businesses.",
                focus: [
                  "Unit economics & pipeline structures",
                  "Custom AI business logic integration",
                  "Service pricing & client contracts",
                ],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border border-purple-950/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between bg-white hover:border-orange-500/20 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black text-orange-500 uppercase tracking-wider">
                      {item.tier}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-950/20" />
                  </div>
                  <h4 className="text-lg font-black tracking-tight text-purple-950 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-purple-950/50 font-medium leading-relaxed">
                    {item.intent}
                  </p>

                  <hr className="border-purple-950/5 pt-2" />

                  <ul className="space-y-2.5">
                    {item.focus.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-2 text-xs text-purple-950/70 font-semibold leading-relaxed"
                      >
                        <span className="text-orange-500 mt-0.5 shrink-0 select-none">
                          ▪
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-purple-950/5 text-[11px] font-black text-purple-950 uppercase tracking-wider">
                  Verified Ingestion Track
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: HUMAN VALIDATION FRAMEWORK */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 bg-purple-950 text-white rounded-[2.5rem] p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />

            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block">
              The "You Are Not Alone" Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Dismantling Extreme Isolation Layers
            </h3>
            <p className="text-xs sm:text-sm text-white/75 font-medium leading-relaxed">
              Technical burnout is a direct byproduct of unvalidated isolation.
              We construct structured, real-time channels where developers can
              process roadblocks, share authentic career stress factors, and
              reclaim mental balance without judgment.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs font-bold text-white/90">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-orange-500" /> Weekly
                Circles
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-orange-500" /> Safe
                Architecture Spaces
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <div>
              <h4 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
                Accountability Parameters
              </h4>
              <h5 className="text-xl font-black tracking-tight text-purple-950 mt-1">
                Proactive Human Synchronization
              </h5>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Bi-Weekly Mental Check-Ins",
                  desc: "Coordinated structural meetings mapping developer fatigue indexes and operational anxieties before they trigger workspace failure.",
                },
                {
                  label: "Safe Unfiltered Code Review",
                  desc: "No tech egos allowed. A dedicated, clean sandbox workspace where juniors can present broken or fragmented systems safely.",
                },
                {
                  label: "Direct Workspace Safety Nets",
                  desc: "Emergency technical help channels backed by remote engineering managers to pull talent out of complex blockers immediately.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start bg-slate-50/60 border border-purple-950/[0.01] p-4 rounded-xl"
                >
                  <span className="text-xs font-bold text-orange-500 font-mono bg-orange-50 border border-orange-100 rounded px-2 py-0.5 shrink-0 select-none">
                    0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h6 className="text-xs font-black text-purple-950 tracking-tight uppercase">
                      {item.label}
                    </h6>
                    <p className="text-xs text-purple-950/60 font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: LOCAL BUSINESS OUTREACH MANIFESTO */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-orange-50/40 border border-orange-200/40 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-950/[0.01] rounded-bl-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-black text-purple-950/50 uppercase tracking-widest bg-white border border-purple-950/5 px-2.5 py-1 rounded">
                Regional Mobilization Track
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950 leading-tight pt-1">
                Grounding Local Commerce in Technical Reality
              </h3>
            </div>
            <div className="lg:col-span-7">
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                We strip out the futuristic tech buzzwords to provide local
                enterprises and creators with clean, high-utility operational
                blueprints. Our continuous outreaches deliver physical
                frameworks, direct workflows, and automated logic setups right
                to business doorsteps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-purple-950/5">
            {[
              {
                title: "Targeted Ingestion Letters",
                text: "Direct, transparent operational diagnostic materials tailored to physical commercial storefront parameters.",
              },
              {
                title: "Clean AI Workflows",
                text: "Deploying automated customer capturing databases and workflow logic built entirely without abstract tech layouts.",
              },
              {
                title: "No Futuristic Overkill",
                text: "Pure information architecture structured to lower operational overhead margins immediately and safely.",
              },
              {
                title: "Direct Account Linkage",
                text: "Connecting offline merchants seamlessly to verified local tech talent pools within the iLead grid.",
              },
            ].map((block, bIdx) => (
              <div
                key={bIdx}
                className="space-y-1.5 bg-white p-5 rounded-xl border border-purple-950/[0.02]"
              >
                <h4 className="text-xs font-black text-purple-950 tracking-tight uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{" "}
                  {block.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-purple-950/60 font-medium leading-relaxed pl-3.5">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SECTION: PARTNERS & SPONSORSHIPS MATRIX */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT SIDE: STRATEGIC CALL TO ACTION */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="space-y-3">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                Ecosystem Backing
              </span>
              <h3 className="text-3xl font-black tracking-tight text-purple-950">
                Fueling Infrastructure Together
              </h3>
              <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
                iLead scales through clear, high-utility alignments. We invite
                forward-thinking technology firms, educational institutions,
                regional commerce brands, and individual benefactors to back our
                talent layers and resource infrastructure.
              </p>
            </div>

            {/* DUAL ACTION BUTTON INTERACTIONS */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
              <button
                type="button"
                className="bg-purple-950 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center"
                onClick={() => navigate("/about-ilead/partners-and-sponsors")}
              >
                Become a Partner
              </button>
              <button
                type="button"
                className="bg-white hover:bg-slate-50 text-purple-950 font-black text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl border border-purple-950/10 transition-all cursor-pointer text-center"
                onClick={() => navigate("/about-ilead/partners-and-sponsors")}
              >
                Become a Sponsor
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: TWO-TRACK INTAKE EXPLANATION MATRIX */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* TRACK 1: PARTNERSHIP PATHWAYS */}
            <div className="bg-slate-50/60 border border-purple-950/[0.02] p-6 sm:p-8 rounded-[2rem] space-y-4 hover:bg-white hover:shadow-sm transition-all duration-300">
              <div className="w-9 h-9 bg-purple-950 text-white rounded-xl flex items-center justify-center text-sm font-black select-none">
                🤝
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black tracking-tight text-purple-950 uppercase">
                  Partnership Tracks
                </h4>
                <span className="text-[10px] text-orange-500 font-mono font-black uppercase tracking-wider block">
                  Operational Alignment
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                For companies or academic groups aiming to integrate code
                modules, host physical local business outreaches, deploy remote
                engineering talent pipelines, or provide direct mentorship
                resources to our active cohorts.
              </p>
              <hr className="border-purple-950/5 pt-1" />
              <div className="text-[11px] text-purple-950/40 font-bold">
                Focus: Coordinated System Integrations
              </div>
            </div>

            {/* TRACK 2: SPONSORSHIP PATHWAYS */}
            <div className="bg-slate-50/60 border border-purple-950/[0.02] p-6 sm:p-8 rounded-[2rem] space-y-4 hover:bg-white hover:shadow-sm transition-all duration-300">
              <div className="w-9 h-9 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl flex items-center justify-center text-sm font-black select-none">
                ⚡
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black tracking-tight text-purple-950 uppercase">
                  Sponsorship Tracks
                </h4>
                <span className="text-[10px] text-orange-500 font-mono font-black uppercase tracking-wider block">
                  Resource Provision
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                For benefactors funding capital requirements—directly
                provisioning hardware setup to the Equipment Fund, offsetting
                platform bandwidth allocation fees, or sponsoring micro-grants
                for outstanding student projects.
              </p>
              <hr className="border-purple-950/5 pt-1" />
              <div className="text-[11px] text-purple-950/40 font-bold">
                Focus: Direct Infrastructure Scaling
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
