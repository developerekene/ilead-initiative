import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";

/* ─── Static content ──────────────────────────────── */

const VALUE_PILLARS = [
  {
    icon: "🌱",
    title: "Radical Inclusivity",
    desc: "Building support frameworks like our Disability Panels and cross-regional mentorship tiers so nobody is locked out of global talent workspaces.",
  },
  {
    icon: "⚙️",
    title: "Practical Application",
    desc: "Rejecting abstract fluff in favor of rigorous, career-focused skill blocks tailored around actual macroeconomic needs.",
  },
  {
    icon: "🤝",
    title: "Human Validation",
    desc: "Providing active peer safety nets, direct code reviews, and physical resources to combat developer and creator burnout.",
  },
  {
    icon: "🔁",
    title: "Mutual Elevation",
    desc: "Growth is a loop — as members level up, they mentor the next cohort and keep the entire ecosystem compounding forward.",
  },
];

const TIMELINE = [
  {
    step: "Mar 2026",
    title: "The Genesis",
    desc: "iLead was founded with a bold operational mandate: to spread an empowering tech ideology, fight professional isolation, and help individuals live purposeful, unblocked lives using digital tools.",
  },
  {
    step: "Spring 2026",
    title: "Ecosystem Expansion",
    desc: "Launched targeted community initiatives, including structural mentorship pairing frameworks and peer-backed crowd-funding resources like the Equipment Fund to unlock technical access barriers.",
  },
  {
    step: "Jun 2026",
    title: "Local & Regional Outreaches",
    desc: "Initiated deep offline-to-online regional campaigns — deploying clean, informative physical and digital assets across business sectors to bridge local commerce with automated AI systems.",
  },
  {
    step: "The Horizon",
    title: "Autonomous Regional Ecosystems",
    desc: "Scaling borderless human capability as regional technology ecosystems run autonomously, powered by the resilient network iLead continues to anchor.",
  },
];

/* ─── Page ────────────────────────────────────────── */

const ILEADVision: React.FC = () => {
  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="The iLEAD Vision"
        firstTitle="Unblocked."
        secondTitle="Talent without"
        thirdTitle="Barriers"
        desc="The iLEAD Vision is a long-range blueprint: a resilient, self-sustaining global talent network where structural inequalities are bypassed through open digital integration — positioning creators, engineers, and local businesses to lead their regional technology ecosystems autonomously."
        buttonOneText="Explore Our Tracks"
        buttonTwoText="Join the Ecosystem"
        btnOneNavigation="/about-ilead"
        btnTwoNavigation="/join-our-community"
      />

      {/* ─── VISION & MISSION DUAL-CORE ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-b border-purple-950/5">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
            The Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950 pt-2">
            Mission & Vision
          </h2>
          <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed">
            Two complementary cores drive everything we build — the operational
            mandate that grounds us today, and the long-range horizon we are
            scaling toward.
          </p>
        </div>

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

      {/* ─── CORE VALUE PILLARS ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Core Values
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
          {VALUE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-slate-50 border border-purple-950/[0.02] p-6 sm:p-8 rounded-2xl space-y-3 hover:bg-white hover:shadow-md transition-all duration-300"
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

      {/* ─── THE FOUNDATIONAL TIMELINE ─── */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest">
              The Journey
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Our Foundational Timeline
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TIMELINE.map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-xs font-black text-orange-400 tracking-wider font-mono">
                  {item.step}
                </span>
                <h4 className="text-base font-black tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Be part of the vision
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              Join a coordinated human engine built to spread tech ideology and
              elevate professional vectors — and help us build a world without
              barriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Join the Ecosystem
              </Link>
              <Link
                to="/about-ilead"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Learn About iLead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ILEADVision;