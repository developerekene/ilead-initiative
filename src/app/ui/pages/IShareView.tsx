import React, { useState } from "react";
import { PostType } from "../../utils/Ishareschema";
import IShareVitalStats from "../components/ishare/Isharevitalstats";
import TopDonorsCarousel from "../components/ishare/Topdonorscarousel ";
import DonorsVolunteerMeter from "../components/ishare/Donorsvolunteermeter";
import IShareFeed from "../components/ishare/Isharefeed";
import CommunityAssistMeter from "../components/ishare/Communityassistmeter";
import IGiveModal from "../components/ishare/Igivemodal";
import INeedModal from "../components/ishare/Ineedmodal";
// import IShareFeed from "./IShareFeed";
// import IGiveModal from "./IGiveModal";
// import INeedModal from "./INeedModal";
// import IShareVitalStats from "./IShareVitalStats";
// import DonorsVolunteerMeter from "./DonorsVolunteerMeter";
// import TopDonorsCarousel from "./TopDonorsCarousel";
// import CommunityAssistMeter from "./CommunityAssistMeter";

const ISharePage: React.FC = () => {
  const [iGiveOpen, setIGiveOpen] = useState(false);
  const [iNeedOpen, setINeedOpen] = useState(false);

  const handleCreatePost = (type: PostType) => {
    if (type === "offer_give") setIGiveOpen(true);
    else setINeedOpen(true);
  };

  return (
    <div className="w-full bg-white">
      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 pt-16 pb-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Peer-to-Peer Exchange
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
            iShare, Give What You Can.
            <br />
            <span className="text-orange-400">Ask for What You Need.</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-200/70 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            A zero-hierarchy resource exchange where skills, hardware, and
            mentorship flow freely within our community. Every post is an act of
            solidarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIGiveOpen(true)}
              className="bg-orange-500 hover:bg-white hover:text-purple-950 text-white font-black px-8 py-4 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              iGive — Share a Resource
            </button>
            <button
              onClick={() => setINeedOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5"
            >
              iNeed — Post a Request
            </button>
          </div>
        </div>
      </div>

      {/* ── Vital Stats ── */}
      <IShareVitalStats />

      {/* ── Top Donors Carousel ── */}
      <TopDonorsCarousel />

      {/* ── Donors / Volunteer Meter ── */}
      <DonorsVolunteerMeter />

      {/* ── Main Feed ── */}
      <IShareFeed onCreatePost={handleCreatePost} />

      {/* ── Community Assist Meter (personal dashboard) ── */}
      <CommunityAssistMeter />

      {/* ── Modals ── */}
      <IGiveModal isOpen={iGiveOpen} onClose={() => setIGiveOpen(false)} />
      <INeedModal isOpen={iNeedOpen} onClose={() => setINeedOpen(false)} />
    </div>
  );
};

export default ISharePage;

// import React from "react";
// import Hero from "../components/home/Hero";

// const IShareView = () => {
//   return (
//     <div>
//       <Hero
//         badge="iShare Community Exchange"
//         firstTitle="Share your journey."
//         secondTitle="Lift as you"
//         thirdTitle="climb"
//         desc="True impact shouldn't be kept to yourself. iShare is our community-driven storytelling and support network where individuals map out real life challenges, personal victories, and practical paths to help others grow, ensuring nobody has to figure life out alone."
//         buttonOneText="Explore Stories"
//         buttonTwoText="Share Your Journey"
//         btnOneNavigation="/"
//         btnTwoNavigation="/"
//       />
//     </div>
//   );
// };

// export default IShareView;
