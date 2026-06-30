import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Campaigns from "../components/campaigncomponents/Campaigns";
import CreateCampaignForm from "../components/campaigncomponents/CreateCampaignForm";
import { selectUser } from "../../redux/slices/User";
import { type Campaign } from "../../redux/slices/campaignSlice";

const MyCampaignsPage: React.FC = () => {
  // State to control the slide-out form
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allCampaigns: Campaign[] = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );
  const user = useSelector(selectUser);
  const userId = user?.uid;

  type CampaignWithCreatorId = Campaign & { creatorId?: string };

  const myCampaigns = allCampaigns.filter(
    (campaign) =>
      userId && (campaign as CampaignWithCreatorId).creatorId === userId,
  );

  const otherCampaigns = allCampaigns.filter(
    (campaign) =>
      !userId || (campaign as CampaignWithCreatorId).creatorId !== userId,
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-purple-950 tracking-tight">
            My Campaigns
          </h1>
          <p className="text-purple-950/60 font-medium mt-1">
            Manage your created campaigns and explore others from the community.
          </p>
        </div>

        {/* Added a header button so users can create more campaigns once the empty-state disappears */}
        {myCampaigns.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-950 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            + Create New Campaign
          </button>
        )}
      </header>

      {/* Section for User's Campaigns */}
      <section>
        <h2 className="text-xl font-bold text-purple-950 mb-4">
          Your Created Campaigns
        </h2>
        {myCampaigns.length > 0 ? (
          <Campaigns
            campaigns={myCampaigns}
            showHeader={false}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-purple-950/5">
            <p className="text-purple-950/70 font-medium">
              You haven't created any campaigns yet.
            </p>
            {/* Changed from Link to a button that opens the modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-block bg-orange-500 hover:bg-purple-900 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Create Your First Campaign
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-purple-950 mb-4">
          All Other Campaigns
        </h2>
        <Campaigns campaigns={otherCampaigns} showHeader={false} />
      </section>

      <CreateCampaignForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyCampaignsPage;
