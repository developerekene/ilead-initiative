import React, { useState } from "react";
import Campaigns from "../components/home/Campaigns";
import CampaignSearch from "../components/home/CampaignSearch";

const CampaignPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <CampaignSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Campaigns
        showViewAll={false}
        showHeader={false}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default CampaignPage;
