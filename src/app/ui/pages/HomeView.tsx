import React from "react";
import Campaigns from "../components/home/Campaigns";
import Hero from "../components/home/Hero";
import ILeadBentoGrid from "../components/home/ILeadBentoGrid";
import ImpactWorkflows from "../components/home/ImapctWorkFlows";
import ImpactGallery from "../components/home/ImpactGallery";
import TrustBar from "../components/home/TrustBar";

const HomeView: React.FunctionComponent = () => (
  <div>
    <Hero />
    <TrustBar />
    <Campaigns />
    <ILeadBentoGrid />
    <ImpactGallery />
    <ImpactWorkflows />
  </div>
);

export default HomeView;
