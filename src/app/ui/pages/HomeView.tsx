import React from 'react'
import Campaigns from '../components/Campaigns';
import Hero from '../components/Hero';
import ILeadBentoGrid from '../components/ILeadBentoGrid';
import ImpactWorkflows from '../components/ImapctWorkFlows';
import ImpactGallery from '../components/ImpactGallery';
import TrustBar from '../components/TrustBar';

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

export default HomeView