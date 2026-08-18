import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";

/* ─── Static content ──────────────────────────────── */

const WAYS = [
  {
    icon: "🌱",
    title: "Join the Community",
    desc: "Membership is completely free — create a profile and unlock mentorship, workshops, and community support with zero barriers.",
    to: "/join-our-community",
    cta: "Join Free",
  },
  {
    icon: "🤝",
    title: "Volunteer & Back Campaigns",
    desc: "Register as a volunteer or back active workflows across all three tracks and push real initiatives forward.",
    to: "/all-Campaign",
    cta: "Explore Campaigns",
  },
  {
    icon: "🧑‍🏫",
    title: "Become a Mentor",
    desc: "Share your expertise with the next cohort — from tech mentorship to business strategy, your experience matters.",
    to: "/tech-mentorship",
    cta: "Mentor Someone",
  },
  {
    icon: "🔄",
    title: "Share Skills & Resources",
    desc: "Post offers and requests in iShare — swap hardware, skills, and mentorship with a zero-hierarchy community.",
    to: "/iShare",
    cta: "Give in iShare",
  },
  {
    icon: "📚",
    title: "Train & Learn",
    desc: "Join iTrain workshops, study habits assessments, and real-time academic consultation to level up your craft.",
    to: "/iTrain",
    cta: "Start Learning",
  },
  {
    icon: "💝",
    title: "Give & Fund",
    desc: "Contribute to peer-backed pools like the Equipment Fund and help unblock members who lack critical infrastructure.",
    to: "/selfless-giving",
    cta: "Give Back",
  },
  {
    icon: "🏛️",
    title: "Partner & Sponsor",
    desc: "Bring your organization into the ecosystem — sponsor initiatives, share resources, and co-build regional impact.",
    to: "/about-ilead/partners-and-sponsors",
    cta: "Become a Partner",
  },
  {
    icon: "📬",
    title: "Contact & Connect",
    desc: "Have a question or a bold idea? Reach the iLead team directly and let's figure out where you fit best.",
    to: "/contact",
    cta: "Get in Touch",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Join Free",
    desc: "Create your profile at zero cost — access to mentorship, workshops, and community support is always free.",
  },
  {
    step: "02",
    title: "Pick Your Lane",
    desc: "Choose how you want to contribute — mentor, volunteer, give, learn, partner, or all of the above.",
  },
  {
    step: "03",
    title: "Show Up & Give",
    desc: "Start small: post an offer, join a workshop, back a campaign, or share what you know with the community.",
  },
  {
    step: "04",
    title: "Grow the Loop",
    desc: "As you level up, mentor the next person and keep the cycle of mutual elevation compounding forward.",
  },
];

/* ─── Page ────────────────────────────────────────── */

const GetInvolved: React.FC = () => {
  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="Get Involved"
        firstTitle="There's a place."
        secondTitle="Made for"
        thirdTitle="You"
        desc="However you want to contribute — mentor, volunteer, give, learn, or partner — iLead has a lane for you. Every member, every skill, and every act of giving strengthens the ecosystem."
        buttonOneText="Join the Ecosystem"
        buttonTwoText="Explore Campaigns"
        btnOneNavigation="/join-our-community"
        btnTwoNavigation="/all-Campaign"
      />

      {/* ─── WAYS TO GET INVOLVED ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
            Pick Your Lane
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 pt-4">
            Ways to <span className="text-orange-500">Get Involved</span>
          </h2>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed mt-4">
            Eight doors into the ecosystem — start wherever you are today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WAYS.map((way) => (
            <div
              key={way.title}
              className="bg-white border border-purple-950/5 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-2xl hover:border-orange-500/20"
            >
              <div>
                <div className="w-11 h-11 bg-slate-50 border border-purple-950/[0.02] rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:bg-orange-50 transition-colors mb-5">
                  {way.icon}
                </div>
                <h3 className="text-base sm:text-lg font-black text-purple-950 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
                  {way.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-6">
                  {way.desc}
                </p>
              </div>
              <Link
                to={way.to}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
              >
                {way.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest">
              The Path
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              How to Get Involved
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS.map((item) => (
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
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Your lane is waiting
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              Join the ecosystem today and start contributing in the way that
              fits you best — no matter where you're starting from.
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

export default GetInvolved;
