import React, { useState } from "react";
import { PostType } from "../../utils/Ishareschema";
import IShareVitalStats from "../components/ishare/Isharevitalstats";
import TopDonorsCarousel from "../components/ishare/Topdonorscarousel ";
import IShareFeed from "../components/ishare/Isharefeed";
import CommunityAssistMeter from "../components/ishare/Communityassistmeter";
import IGiveModal from "../components/ishare/Igivemodal";
import INeedModal from "../components/ishare/Ineedmodal";
import Hero from "../components/home/Hero";

const ISharePage: React.FC = () => {
  const [iGiveOpen, setIGiveOpen] = useState(false);
  const [iNeedOpen, setINeedOpen] = useState(false);

  const handleCreatePost = (type: PostType) => {
    if (type === "offer_give") setIGiveOpen(true);
    else setINeedOpen(true);
  };

  return (
    <div className="w-full bg-white">
      <Hero
        badge="iShare Community Exchange"
        firstTitle="Give What You Can."
        secondTitle="Ask "
        thirdTitle="Freely"
        desc="A zero-hierarchy resource exchange where skills, hardware, and
            mentorship flow freely within our community. Every post is an act of
            solidarity."
        buttonOneText="Give Resources"
        buttonTwoText="Make a Request"
        btnOneNavigation=" /"
        btnTwoNavigation="/"
        btnOneOnClick={() => setIGiveOpen(true)}
        btnTwoOnClick={() => setINeedOpen(true)}
      />

      <IShareVitalStats />
      <TopDonorsCarousel />
      {/* <DonorsVolunteerMeter /> */}
      <IShareFeed onCreatePost={handleCreatePost} />
      {/* <CommunityAssistMeter /> */}
      <IGiveModal isOpen={iGiveOpen} onClose={() => setIGiveOpen(false)} />
      <INeedModal isOpen={iNeedOpen} onClose={() => setINeedOpen(false)} />
    </div>
  );
};

export default ISharePage;
