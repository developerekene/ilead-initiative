import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/home/Hero";
import Campaigns from "../components/campaigncomponents/Campaigns";
import { RootState } from "../../redux/store";
import { setCampaigns } from "../../redux/slices/campaignSlice";
import { campaignService } from "../../redux/configuration/services/campaign.service";

/* ─── Static content ──────────────────────────────── */

const PILLARS = [
  {
    icon: "💝",
    title: "Selfless Giving",
    desc: "iLead is built on selfless giving — core membership is completely free, so mentorship, skill-building, and community support are never blocked by financial barriers.",
  },
  {
    icon: "🎁",
    title: "Community Crowd-Funding",
    desc: "Peer-backed pools like the Equipment Fund unlock hardware and infrastructure for members who need them, reviewed transparently by the community.",
  },
  {
    icon: "🔄",
    title: "iShare Exchange",
    desc: "A zero-hierarchy exchange where members give resources, skills, and mentorship — and receive freely whenever they're in need.",
  },
  {
    icon: "🏆",
    title: "Recognition & Mutual Elevation",
    desc: "Every act of giving is tracked and celebrated — from Top Givers leaderboards to certificates of contribution.",
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
    title: "Give What You Can",
    desc: "Post an offer, volunteer your time, or contribute to community funding pools — every act counts, big or small.",
  },
  {
    step: "03",
    title: "Match Needs to Offers",
    desc: "Our ecosystem matches your contribution with a member who genuinely needs it, online or in your region.",
  },
  {
    step: "04",
    title: "Celebrate & Multiply",
    desc: "Earn recognition, unlock certificates, and inspire the next circle to give — keeping the loop of selfless giving alive.",
  },
];

const FOCUS_AREAS = [
  "Free Membership",
  "Equipment Fund",
  "iShare Give & Receive",
  "Top Givers Recognition",
  "Volunteer Hours",
  "Community Support",
];

/* ─── Page ────────────────────────────────────────── */

const CultureOfGiving: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all campaigns on mount (Community Giving is a campaign category)
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const fetchedCampaigns = await campaignService.fetchAllCampaigns();
        dispatch(setCampaigns(fetchedCampaigns));
      } catch (error) {
        console.error("Failed to load giving campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [dispatch]);

  const allCampaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );

  const givingCampaigns = allCampaigns.filter(
    (campaign) => campaign.category === "Community Giving",
  );

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="Culture of Giving"
        firstTitle="Give freely."
        secondTitle="Lift"
        thirdTitle="Together"
        desc="Culture of Giving is the heartbeat of iLead — a selfless-giving philosophy that keeps membership free, resources flowing, and every member unblocked. We believe access to mentorship, skill-building, and community support should never be blocked by financial barriers."
        buttonOneText="Explore Giving Workflows"
        buttonTwoText="Join the Ecosystem"
        btnOneNavigation="/all-Campaign"
        btnTwoNavigation="/join-our-community"
      />

      {/* ─── PHILOSOPHY OVERVIEW ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Philosophy Overview
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Giving That Costs Nothing
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            Selfless giving isn't a one-off campaign — it's the operating
            system of the entire ecosystem. Free access, community funding, and
            a culture where giving back is the default.
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
              The Loop
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              How the Culture of Giving Works
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

      {/* ─── LIVE COMMUNITY GIVING CAMPAIGNS ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">
            Live Now
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950">
            Active Community Giving{" "}
            <span className="text-orange-500">Workflows</span>
          </h3>
          <p className="text-base text-purple-950/60 font-medium leading-relaxed mt-4">
            Jump into a running giving initiative, volunteer your time, or back
            the ones you believe in.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : givingCampaigns.length > 0 ? (
          <Campaigns
            campaigns={givingCampaigns}
            showHeader={false}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-16 space-y-4 bg-slate-50 border border-purple-950/5 rounded-[2rem]">
            <span className="text-5xl block">💝</span>
            <h3 className="text-xl font-black text-purple-950">
              No active giving workflows yet
            </h3>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              Be the first to start a Community Giving campaign and open the
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
              Ready to give back?
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              Join a community where giving is the default — post an offer,
              volunteer your time, or start your own giving initiative.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Join the Ecosystem
              </Link>
              <Link
                to="/iShare"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Explore iShare
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CultureOfGiving;