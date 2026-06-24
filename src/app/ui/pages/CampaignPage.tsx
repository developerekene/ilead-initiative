import React, { useState } from "react";
import Campaigns from "../components/campaigncomponents/Campaigns";
import CampaignSearch from "../components/campaigncomponents/CampaignSearch";
import CreateCampaignForm from "../components/campaigncomponents/CreateCampaignForm";

const CampaignPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <CampaignSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateClick={() => setIsModalOpen(true)}
      />
      <Campaigns
        showViewAll={false}
        showHeader={false}
        searchQuery={searchQuery}
      />
      <CreateCampaignForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CampaignPage;
