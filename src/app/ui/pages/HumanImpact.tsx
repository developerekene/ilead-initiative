import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";

/* ─── Types ───────────────────────────────────────── */

interface ImpactStory {
  id: string;
  title: string;
  category: "Tech Mentorship" | "Business Strategy" | "Community Giving";
  reachMetric: {
    label: string;
    value: string;
  };
  narrative: {
    genesis: string; // How we started
    resolution: string; // How it ended / what was achieved
  };
  impact: {
    individual: string; // Impact on the person
    community: string; // Impact on the ecosystem
  };
}

/* ─── Static content ──────────────────────────────── */

const CATEGORY_STYLES: Record<string, string> = {
  "Tech Mentorship": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Business Strategy": "bg-blue-50 text-blue-700 border-blue-200",
  "Community Giving": "bg-purple-50 text-purple-700 border-purple-200",
};

const IMPACT_STORIES: ImpactStory[] = [
  {
    id: "grassroots-literacy-2025",
    title: "The Grassroots Digital Literacy Drive",
    category: "Tech Mentorship",
    reachMetric: { label: "Engineers Mapped", value: "1,240+ Graduated" },
    narrative: {
      genesis:
        "Started with a broken laptop pool and 15 isolated builders trying to self-learn production engineering workflows without structural roadmaps.",
      resolution:
        "Evolved into a rigorous engineering incubator with complete localized mentorship pipelines and a verified open curriculum layer.",
    },
    impact: {
      individual:
        "Aspiring developers from non-traditional backgrounds broke out of technical isolation and mastered production-grade React Native environments.",
      community:
        "Seeded local tech ecosystems with a highly capable talent tier ready to support home-grown digital infrastructure.",
    },
  },
  {
    id: "founders-cohort-one",
    title: "SME Acceleration Cohort Alpha",
    category: "Business Strategy",
    reachMetric: { label: "SME Revenue Growth", value: "Avg +42% YoY" },
    narrative: {
      genesis:
        "Launched to address high failure rates among brilliant local creators who lacked access to scalable operations and financial projection frameworks.",
      resolution:
        "Delivered 450 hours of targeted, high-touch strategic review workshops, transforming informal ideas into auditable business setups.",
    },
    impact: {
      individual:
        "Founders gained total mastery over their unit economics, shifting from chaotic day-to-day survival to confident, strategic expansion.",
      community:
        "Built an independent economic collective where local businesses trade skills, share operational data, and insulate each other from market shocks.",
    },
  },
  {
    id: "hardware-circle-2025",
    title: "The Selfless Circle Infrastructure Pool",
    category: "Community Giving",
    reachMetric: { label: "Workstations Deployed", value: "84 Systems" },
    narrative: {
      genesis:
        "Began when we noticed elite engineering talents completely stalled because their personal hardware couldn't run modern mobile emulators smoothly.",
      resolution:
        "Established a zero-interest, crowd-fueled workspace fund that completely bypassed institutional gatekeepers to supply pro-tier setups.",
    },
    impact: {
      individual:
        "Gave individual builders the computing capacity needed to build, compile, and ship complex software solutions without local hardware bottlenecks.",
      community:
        "Leveled the digital resource playing field, ensuring that structural poverty never limits technical genius within our workspace.",
    },
  },
  {
    id: "mental-safety-net",
    title: 'The "You Are Not Alone" Pilot',
    category: "Community Giving",
    reachMetric: { label: "Isolation Check-Ins", value: "3,200+ Hours" },
    narrative: {
      genesis:
        "Triggered by severe developer burnout and professional alienation creeping across isolated remote workers and indie builders.",
      resolution:
        "Deployed a continuous professional safety net featuring daily asynchronous catch-ups and localized workspace check-ins.",
    },
    impact: {
      individual:
        "Engineers recovered their psychological safety, separating their human self-worth from strict production metrics and code output.",
      community:
        "Transformed an otherwise competitive, cold industry into a deeply human cooperative that looks out for its collective wellbeing.",
    },
  },
  {
    id: "open-source-incubator",
    title: "Ecosystem Infrastructure Hackathon",
    category: "Tech Mentorship",
    reachMetric: { label: "Production Apps Live", value: "7 Core Utilities" },
    narrative: {
      genesis:
        "Conceived to transition junior developers from building standard generic tutorial components to owning real, live public applications.",
      resolution:
        "Brought teams together for a 48-hour sprint, yielding production-ready software solutions utilized by real community entities.",
    },
    impact: {
      individual:
        "Junior devs gained true collaborative product experience — managing git conflicts, continuous integration pipelines, and strict QA standards.",
      community:
        "Provided open-source civic utilities to local groups, proving that community tech can solve community problems independently.",
    },
  },
  {
    id: "capital-bridge-initiative",
    title: "The Angel Mentor Matchway",
    category: "Business Strategy",
    reachMetric: { label: "Seed Funding Routed", value: "£140k+ Raised" },
    narrative: {
      genesis:
        "Initiated because brilliant, underrepresented founders were consistently locked out of traditional angel networks and venture capital rooms.",
      resolution:
        "Constructed an alternative pitching layout that matched builders directly with seasoned operators based on raw execution data.",
    },
    impact: {
      individual:
        "Gave talented minority operators their first institutional runway without requiring they sacrifice core equity structures prematurely.",
      community:
        "Created an autonomous funding precedent, encouraging early leaders to immediately reinvest back into the next local builder wave.",
    },
  },
];

const STATS = [
  { icon: "🧑‍💻", label: "Engineers Graduated", value: "1,240+" },
  { icon: "📈", label: "SME Revenue Growth", value: "+42% YoY" },
  { icon: "🖥️", label: "Workstations Deployed", value: "84" },
  { icon: "💷", label: "Seed Funding Routed", value: "£140k+" },
  { icon: "🕒", label: "Isolation Check-Ins", value: "3,200+" },
  { icon: "🚀", label: "Production Apps Live", value: "7" },
];

/* ─── Page ────────────────────────────────────────── */

const HumanImpact: React.FC = () => {
  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="Human Impact Stories"
        firstTitle="Real people."
        secondTitle="Real"
        thirdTitle="Impact"
        desc="Behind every workflow is a person whose life changed — and a community that grew stronger. These are the stories of builders, founders, and givers who moved from isolation to impact with iLead."
        buttonOneText="Explore Our Tracks"
        buttonTwoText="Join the Ecosystem"
        btnOneNavigation="/about-ilead"
        btnTwoNavigation="/join-our-community"
      />

      {/* ─── IMPACT STATS ─── */}
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-16 border-b border-purple-950/5">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
            The Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950 pt-4">
            Impact, Measured
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 border border-purple-950/[0.02] rounded-2xl p-5 text-center space-y-1.5 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <span className="text-2xl block">{stat.icon}</span>
              <p className="text-lg sm:text-xl font-black text-purple-950 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-950/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IMPACT STORIES ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
            Verified Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 pt-4">
            See What We Have{" "}
            <span className="text-orange-500">Achieved</span>
          </h2>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed mt-4">
            Real proof lives in execution, not promises. Here is how our
            finished workflows structurally re-engineered individual careers
            and broader tech ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
          {IMPACT_STORIES.map((story) => {
            const catStyle =
              CATEGORY_STYLES[story.category] ??
              "bg-slate-50 text-slate-700 border-slate-200";

            return (
              <div
                key={story.id}
                className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/5 hover:border-orange-500/10 group"
              >
                {/* Meta Category and High-Impact Counter */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-6 border-b border-purple-950/5">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-lg border ${catStyle}`}
                  >
                    {story.category}
                  </span>
                  <div className="flex items-center gap-2 text-purple-950">
                    <span className="text-xs font-bold text-purple-950/50 uppercase tracking-wider">
                      {story.reachMetric.label}:
                    </span>
                    <span className="text-sm font-black bg-orange-500 text-white px-3 py-1 rounded-full tracking-tight">
                      {story.reachMetric.value}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-purple-950 leading-tight mb-6 group-hover:text-purple-700 transition-colors duration-200">
                  {story.title}
                </h3>

                {/* Narrative Breakdown (Genesis → Resolution) */}
                <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-purple-950/[0.02]">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 block mb-1">
                      How We Started
                    </span>
                    <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                      {story.narrative.genesis}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-purple-950/5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-purple-900 block mb-1">
                      How It Completed
                    </span>
                    <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                      {story.narrative.resolution}
                    </p>
                  </div>
                </div>

                {/* Impact Segregation Vector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mb-8">
                  <div className="border-l-2 border-orange-500 pl-4">
                    <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-1">
                      Impact on the Person
                    </h4>
                    <p className="text-xs text-purple-950/60 font-medium leading-relaxed">
                      {story.impact.individual}
                    </p>
                  </div>
                  <div className="border-l-2 border-purple-900 pl-4">
                    <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-1">
                      Impact on the Community
                    </h4>
                    <p className="text-xs text-purple-950/60 font-medium leading-relaxed">
                      {story.impact.community}
                    </p>
                  </div>
                </div>

                {/* Static Bottom Action Strip */}
                <div className="pt-4 border-t border-purple-950/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950/40 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    Verified Milestone
                  </span>
                  <Link
                    to={`/archive/${story.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-purple-950 hover:text-orange-500 transition-colors uppercase tracking-widest"
                  >
                    Case Study
                    <svg
                      className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Be Part of the Next Success Story
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              We turn deep isolation into active engineering platforms. Lend
              your React Native, design, or business leadership skill sets
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Contribute Your Skills
              </Link>
              <Link
                to="/all-Campaign"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Explore Campaigns
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HumanImpact;