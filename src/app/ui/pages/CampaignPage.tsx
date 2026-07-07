import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Campaigns from "../components/campaigncomponents/Campaigns";
import CampaignSearch from "../components/campaigncomponents/CampaignSearch";
import CreateCampaignForm from "../components/campaigncomponents/CreateCampaignForm";
import { setCampaigns } from "../../redux/slices/campaignSlice";
import { campaignService } from "../../redux/configuration/services/campaign.service";

const CampaignPage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const fetchedCampaigns = await campaignService.fetchAllCampaigns();
        dispatch(setCampaigns(fetchedCampaigns));
      } catch (error) {
        console.error("Failed to load campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [dispatch]);

  return (
    <div>
      <CampaignSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateClick={() => setIsModalOpen(true)}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <Campaigns
          showViewAll={false}
          showHeader={false}
          searchQuery={searchQuery}
        />
      )}

      <CreateCampaignForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CampaignPage;
