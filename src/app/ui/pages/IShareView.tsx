import React, { useState } from "react";
import { PostType } from "../../utils/Ishareschema";
import IShareVitalStats from "../components/ishare/Isharevitalstats";
import TopDonorsCarousel from "../components/ishare/Topdonorscarousel ";
import IShareFeed from "../components/ishare/Isharefeed";
import IGiveModal from "../components/ishare/Igivemodal";
import INeedModal from "../components/ishare/Ineedmodal";
import Hero from "../components/home/Hero";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slices/User";
import toast from "react-hot-toast";

const ISharePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [iGiveOpen, setIGiveOpen] = useState(false);
  const [iNeedOpen, setINeedOpen] = useState(false);

  const handleCreatePost = (type: PostType) => {
    if (!isLoggedIn) {
      toast.error("You need to be signed in to post.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", { state: { from: location } });
      return;
    }

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
        btnOneOnClick={() => handleCreatePost("offer_give")}
        btnTwoOnClick={() => handleCreatePost("request_need")}
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
