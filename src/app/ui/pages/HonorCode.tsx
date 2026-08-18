import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";

/* ─── Static content ──────────────────────────────── */

const VALUES = [
  {
    icon: "💝",
    title: "Selfless Giving",
    desc: "Membership is free and giving is the default — mentorship, skill-building, and community support are never blocked by financial barriers.",
  },
  {
    icon: "🚀",
    title: "Mutual Elevation",
    desc: "Every member lifts as they climb — success is measured by how many people you helped grow alongside you.",
  },
  {
    icon: "🔄",
    title: "Cross-Disciplinary Collaboration",
    desc: "We break silos between tech, business, and community — sharing knowledge freely across every discipline and cohort.",
  },
  {
    icon: "🛡️",
    title: "Safety & Inclusivity",
    desc: "Harassment, discrimination, and hate speech have zero place here. Everyone is welcome regardless of background, identity, or experience level.",
  },
];

const COMMITMENTS = [
  {
    step: "01",
    title: "Respect Everyone",
    desc: "Treat every member with dignity. Harassment, discrimination, hate speech, or any form of harmful behaviour will not be tolerated.",
  },
  {
    step: "02",
    title: "Give Before You Take",
    desc: "Contribute skills, resources, or mentorship before you ask — and keep the loop of selfless giving alive in every exchange.",
  },
  {
    step: "03",
    title: "Honor Your Commitments",
    desc: "Show up to the sessions you booked, deliver what you promise, and communicate openly when plans change.",
  },
  {
    step: "04",
    title: "Protect the Community",
    desc: "Flag harmful content, respect members' privacy, and keep shared knowledge within the ecosystem it was built for.",
  },
];

/* ─── Page ────────────────────────────────────────── */

const HonorCode: React.FC = () => {
  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="The Honor Code"
        firstTitle="Our community."
        secondTitle="Runs on"
        thirdTitle="Respect"
        desc="The iLead Honor Code is our shared commitment to selfless giving, mutual elevation, and a safe, inclusive ecosystem. Every member agrees to uphold these values in every interaction — online and offline."
        buttonOneText="Join the Ecosystem"
        buttonTwoText="Read Our Values"
        btnOneNavigation="/join-our-community"
        btnTwoNavigation="/vision"
      />

      {/* ─── CORE VALUES ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Core Values
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Standards We Uphold
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            These values anchor every relationship in the ecosystem — from
            mentorship pairings to iShare exchanges and campaign collaborations.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="bg-slate-50 border border-purple-950/[0.02] p-6 sm:p-8 rounded-2xl space-y-3 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white border border-purple-950/5 rounded-xl flex items-center justify-center text-lg shadow-sm">
                {value.icon}
              </div>
              <h4 className="text-base font-black tracking-tight text-purple-950">
                {value.title}
              </h4>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE HONOR CODE ─── */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest">
              Our Commitments
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              The Honor Code We Share
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {COMMITMENTS.map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-3xl font-black text-orange-400">
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

          {/* Reporting note */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-3 text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
            <span className="text-base select-none">🚩</span>
            <p>
              <strong className="text-white">Reporting violations.</strong> We
              take every violation seriously. Flag harmful posts directly from
              the feed or reach out to the team — accounts that violate the
              Honor Code may be suspended to protect the community.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Join a community that respects you
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              By joining iLead, you pledge to uphold this code — and in return,
              you get a safe, generous, and elevating community behind you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Join the Ecosystem
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Contact the Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HonorCode;
