import React from "react";
import Campaigns from "../components/home/Campaigns";
import Hero from "../components/home/Hero";
import ILeadBentoGrid from "../components/home/ILeadBentoGrid";
import ImpactWorkflows from "../components/home/ImapctWorkFlows";
import ImpactGallery from "../components/home/ImpactGallery";
import TrustBar from "../components/home/TrustBar";

const HomeView: React.FunctionComponent = () => (
  <div>
    <Hero
      badge="A Cross-Disciplinary Talent Ecosystem"
      firstTitle="Cultivate potential."
      secondTitle="Without the"
      thirdTitle="isolation"
      desc="True progress does not happen in a vacuum. iLEAD brings together builders, thinkers, and creators across backgrounds and disciplines to exchange insight,
            bridge the opportunity gap, and build real-world digital literacy together."
      buttonOneText="Join the Ecosystem"
      buttonTwoText="Learn More"
      btnTwoNavigation="/about-ilead"
      btnOneNavigation="/join-our-community"
    />
    <TrustBar />
    <Campaigns />
    <ILeadBentoGrid />
    <ImpactGallery />
    <ImpactWorkflows />
  </div>
);

export default HomeView;
