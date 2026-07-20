import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import Campaigns from "../components/campaigncomponents/Campaigns";
import CreateCampaignForm from "../components/campaigncomponents/CreateCampaignForm";
import { selectUser } from "../../redux/slices/User";
import {
  type Campaign,
  setCampaigns,
  removeCampaignItem,
} from "../../redux/slices/campaignSlice";
import { campaignService } from "../../redux/configuration/services/campaign.service";
import toast from "react-hot-toast";
import EditCampaignForm from "../components/campaigncomponents/EditCampaignForm";
import {
  FormModal,
  FormActions,
} from "../components/formcomponent/FormComponents";

const MyCampaignsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const allCampaigns: Campaign[] = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );

  const user = useSelector(selectUser);
  const userId = user?.uid;

  const myCampaigns = allCampaigns.filter(
    (campaign) => userId && campaign.creatorId === userId,
  );

  const otherCampaigns = allCampaigns.filter(
    (campaign) => !userId || campaign.creatorId !== userId,
  );

  // Step 1: Open the modal instead of the native window alert
  const handleDelete = (campaignId: string) => {
    setCampaignToDelete(campaignId);
  };

  // Step 2: Handle the actual async database deletion
  const confirmDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId || !campaignToDelete) return;

    setIsDeleting(true);
    try {
      await campaignService.deleteCampaign(userId, campaignToDelete);
      dispatch(removeCampaignItem(campaignToDelete));
      toast.success("Campaign deleted successfully.", {
        style: { background: "#4BB543", color: "#fff" },
      });
      setCampaignToDelete(null);
    } catch (error) {
      toast.error("Failed to delete campaign.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

        {myCampaigns.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-950 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            + Create New Campaign
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-bold text-purple-950 mb-4">
              Your Created Campaigns
            </h2>
            {myCampaigns.length > 0 ? (
              <Campaigns
                campaigns={myCampaigns}
                showHeader={false}
                showViewAll={false}
                allowEdit={true}
                onEdit={setCampaignToEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-purple-950/5">
                <p className="text-purple-950/70 font-medium">
                  You haven't created any campaigns yet.
                </p>
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
        </>
      )}

      {/* Campaign Creation Drawer */}
      <CreateCampaignForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Campaign Editing Drawer */}
      <EditCampaignForm
        isOpen={!!campaignToEdit}
        onClose={() => setCampaignToEdit(null)}
        campaignToEdit={campaignToEdit}
      />

      <FormModal
        isOpen={!!campaignToDelete}
        onClose={() => !isDeleting && setCampaignToDelete(null)}
        title="Delete Campaign"
        badge="Danger"
        badgeVariant="orange"
        maxWidth="max-w-md"
      >
        <form onSubmit={confirmDelete} className="flex flex-col gap-6">
          <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
            Are you sure you want to permanently delete this campaign? This action cannot be undone and all active configurations will be lost.
          </p>

          <FormActions
            onCancel={() => setCampaignToDelete(null)}
            submitLabel="Delete Campaign"
            isSubmitting={isDeleting}
            loadingLabel="Deleting..."
            submitVariant="danger" 
          />
        </form>
      </FormModal>
    </div>
  );
};

export default MyCampaignsPage;