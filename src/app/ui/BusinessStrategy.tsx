import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Hero from "./components/home/Hero";
import Campaigns from "./components/campaigncomponents/Campaigns";
import { RootState } from "../redux/store";
import { setCampaigns } from "../redux/slices/campaignSlice";
import { campaignService } from "../redux/configuration/services/campaign.service";

/* ─── Static content ──────────────────────────────── */

const PILLARS = [
  {
    icon: "💼",
    title: "Founder Mentorship",
    desc: "Get paired with verified operators and entrepreneurs who review your venture, stress-test your model, and sharpen your execution plan.",
  },
  {
    icon: "📊",
    title: "Market & Outreach Strategy",
    desc: "Structured local market research, community outreach metrics, and go-to-market playbooks built for your real customers and region.",
  },
  {
    icon: "🧾",
    title: "Planning & Pitching",
    desc: "From business plans to investor decks — workshops that make your venture fundable and your numbers investor-ready.",
  },
  {
    icon: "🌐",
    title: "Local Business Networks",
    desc: "Cross-regional partnerships, vendor connections, and community capital pools like the Equipment Fund to unlock real infrastructure.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Join the Ecosystem",
    desc: "Create a profile and tell us your business idea, current stage, target market, and the resources you need to grow.",
  },
  {
    step: "02",
    title: "Get Matched with a Strategist",
    desc: "Our team pairs you with an experienced mentor whose industry and stage match your venture's real needs.",
  },
  {
    step: "03",
    title: "Build & Launch",
    desc: "Attend planning labs, validate your market, craft your pitch, and access funding pools to get your venture moving.",
  },
  {
    step: "04",
    title: "Scale & Give Back",
    desc: "Hire from the community, open your network to the next founders, and multiply the impact of your success.",
  },
];

const FOCUS_AREAS = [
  "Startup Validation",
  "Business & Financial Planning",
  "Local Market Outreach",
  "Sales & Growth Strategy",
  "Fundraising & Grants",
  "Operations & Logistics",
];

/* ─── Page ────────────────────────────────────────── */

const BusinessStrategy: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all campaigns on mount (Business Strategy is a campaign category)
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const fetchedCampaigns = await campaignService.fetchAllCampaigns();
        dispatch(setCampaigns(fetchedCampaigns));
      } catch (error) {
        console.error("Failed to load business strategy campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [dispatch]);

  const allCampaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );

  const businessCampaigns = allCampaigns.filter(
    (campaign) => campaign.category === "Business Strategy",
  );

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="Business Strategy Track"
        firstTitle="Think like a CEO."
        secondTitle="Execute with"
        thirdTitle="Strategy"
        desc="Business Strategy is iLead's flagship track for founders — pairing emerging ventures with verified operators, local market outreach, structured business planning, and access to community capital pools like the Equipment Fund."
        buttonOneText="Explore Business Workflows"
        buttonTwoText="Join the Ecosystem"
        btnOneNavigation="/all-Campaign"
        btnTwoNavigation="/join-our-community"
      />

      {/* ─── TRACK OVERVIEW ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Track Overview
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Strategy That Builds Real Ventures
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            We don't hand out abstract business theory. We connect founders with
            operators, validate real local markets, and open access to the
            capital and infrastructure your venture actually needs to grow.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {FOCUS_AREAS.map((area) => (
              <span
                key={area}
                className="text-[10px] font-black uppercase tracking-wider text-purple-950/50 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {PILLARS.map((pillar) => (
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

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest">
              The Journey
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              How the Business Strategy Track Works
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

      {/* ─── LIVE BUSINESS STRATEGY CAMPAIGNS ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">
            Live Now
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950">
            Active Business Strategy{" "}
            <span className="text-orange-500">Workflows</span>
          </h3>
          <p className="text-base text-purple-950/60 font-medium leading-relaxed mt-4">
            Jump into a running business initiative, register as a volunteer, or
            back the ventures you believe in.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : businessCampaigns.length > 0 ? (
          <Campaigns
            campaigns={businessCampaigns}
            showHeader={false}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-16 space-y-4 bg-slate-50 border border-purple-950/5 rounded-[2rem]">
            <span className="text-5xl block">💼</span>
            <h3 className="text-xl font-black text-purple-950">
              No active business workflows yet
            </h3>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              Be the first to start a Business Strategy campaign and open the
              track for the community.
            </p>
            <Link
              to="/all-Campaign"
              className="inline-flex items-center gap-2 bg-purple-950 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg mt-4"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to build your venture?
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              Join the Business Strategy track, get matched with a strategist,
              and start turning your idea into a thriving local business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Join the Ecosystem
              </Link>
              <Link
                to="/membership"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                View Membership Tiers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessStrategy;
