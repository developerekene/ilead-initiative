import React from "react";
import Campaigns from "../components/campaigncomponents/Campaigns";
import Hero from "../components/home/Hero";
import ILeadBentoGrid from "../components/home/ILeadBentoGrid";
import ImpactWorkflows from "../components/home/ImapctWorkFlows";
import ImpactGallery from "../components/home/ImpactGallery";
import TrustBar from "../components/home/TrustBar";
import ILeadMarketingSection from "../components/ILeadMarketingSection";

const HomeView: React.FunctionComponent = () => (
  <div>
    <Hero
      badge="A Cross-Disciplinary Talent Ecosystem"
      firstTitle="Learn"
      secondTitle="Connect"
      thirdTitle="Grow"
      desc="Empowering Africa through learning, Skills and Opportunities. We are an innovative web platform designed to connect, learners, educators and professionals across Africa and beyond."
      buttonOneText="Join the Ecosystem"
      buttonTwoText="Learn More"
      btnTwoNavigation="/about-ilead"
      btnOneNavigation="/join-our-community"
    />
    <TrustBar />
    <Campaigns />
    <ILeadMarketingSection />
    <ILeadBentoGrid />
    <ImpactGallery />
    <ImpactWorkflows />
  </div>
);

export default HomeView;
