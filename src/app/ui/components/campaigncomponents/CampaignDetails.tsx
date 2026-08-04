import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store";
import {
  type Campaign,
  updateCampaignItem,
  setCampaigns,
} from "../../../redux/slices/campaignSlice";
import { campaignService } from "../../../redux/configuration/services/campaign.service";
import Button from "../Button";
import { toast } from "react-hot-toast";

const CampaignDetails: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const campaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );
  const isUserLoggedIn = user.isLoggedIn;

  const campaign = campaigns.find((c) => c.id === campaignId);
  const [isLoading, setIsLoading] = useState(!campaign);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [campaignId]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const fetchedCampaigns = await campaignService.fetchAllCampaigns();
        dispatch(setCampaigns(fetchedCampaigns));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!campaign) {
      fetchCampaigns();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, campaign]);

  const hasVolunteered = Boolean(
    user.uid && campaign?.volunteeredBy?.includes(user.uid),
  );
  const hasBacked = Boolean(
    user.uid && campaign?.backedBy?.includes(user.uid),
  );

  const volunteersCount =
    campaign?.volunteersCount ?? (campaign?.volunteeredBy?.length || 0);
  const supportersCount =
    campaign?.supportersCount ?? (campaign?.backedBy?.length || 0);

  if (isLoading) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-purple-950/20 border-t-purple-950 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-black text-purple-950 tracking-tight">
          Loading Campaign...
        </h2>
      </main>
    );
  }

  // Campaign not found guard
  if (!campaign) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-50 border border-purple-950/5 rounded-2xl flex items-center justify-center mb-4 text-purple-950/40 text-xl font-bold">
          🔍
        </div>
        <h2 className="text-xl font-black text-purple-950 tracking-tight">
          Workflow Not Found
        </h2>
        <Link
          to="/all-Campaign"
          className="bg-purple-950 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all mt-6"
        >
          Return to Active Workflows
        </Link>
      </main>
    );
  }

  // ── Button handlers with Optimistic Update & Silent Backend Sync ──
  const handleVolunteer = async () => {
    if (!isUserLoggedIn || !user.uid) {
      navigate("/sign-in", { state: { from: location } });
      toast.error("Authentication required to volunteer. Let's sign you in.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    if (campaign.volunteeredBy?.includes(user.uid)) {
      toast.error("You have already registered as a volunteer for this campaign.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    // Optimistic UI Update
    const prevCampaignState = { ...campaign };
    const currentVolunteers = campaign.volunteersCount ?? (campaign.volunteeredBy?.length || 0);
    const updatedCampaign: Campaign = {
      ...campaign,
      volunteersCount: currentVolunteers + 1,
      volunteeredBy: [...(campaign.volunteeredBy || []), user.uid],
    };

    dispatch(updateCampaignItem(updatedCampaign));
    toast.success("Thank you for joining as a volunteer!", {
      style: { background: "#4BB543", color: "#fff" },
    });

    try {
      if (updatedCampaign.creatorId) {
        await campaignService.updateCampaign(updatedCampaign.creatorId, updatedCampaign);
      }
    } catch (error) {
      console.error("Error saving volunteer participation:", error);
      dispatch(updateCampaignItem(prevCampaignState));
      toast.error("Failed to register volunteer status.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    }
  };

  const handleBackInitiative = async () => {
    if (!isUserLoggedIn || !user.uid) {
      navigate("/sign-in", { state: { from: location } });
      toast.error("Authentication required to back this initiative. Let's sign you in.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    if (campaign.backedBy?.includes(user.uid)) {
      toast.error("You have already backed this initiative.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    // Optimistic UI Update
    const prevCampaignState = { ...campaign };
    const currentSupporters = campaign.supportersCount ?? (campaign.backedBy?.length || 0);
    const updatedCampaign: Campaign = {
      ...campaign,
      supportersCount: currentSupporters + 1,
      backedBy: [...(campaign.backedBy || []), user.uid],
    };

    dispatch(updateCampaignItem(updatedCampaign));
    toast.success("Thank you for backing this initiative!", {
      style: { background: "#4BB543", color: "#fff" },
    });

    try {
      if (updatedCampaign.creatorId) {
        await campaignService.updateCampaign(updatedCampaign.creatorId, updatedCampaign);
      }
    } catch (error) {
      console.error("Error saving supporter backing:", error);
      dispatch(updateCampaignItem(prevCampaignState));
      toast.error("Failed to register backing status.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    }
  };

  return (
    <div className="bg-white min-h-screen text-purple-950 relative overflow-x-hidden">
      <section className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Campaign header */}
        <div className="border-b border-purple-950/5 pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
              {campaign.category}
            </span>
            <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {campaign.statusBadge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 leading-tight mb-6 break-words">
            {campaign.title}
          </h1>
          <p className="text-base sm:text-xl text-purple-950/70 font-medium leading-relaxed max-w-3xl break-words">
            {campaign.description}
          </p>
        </div>

        {/* Body + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Operational Intent & Scope
              </h3>
              <p className="text-sm sm:text-base text-purple-950/80 font-medium leading-relaxed break-words">
                {campaign.longFormBody}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Core Deliverable Benchmarks
              </h3>
              <ul className="space-y-3.5">
                {campaign.keyDeliverables?.map((deliverable, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm sm:text-base text-purple-950/70 font-medium leading-relaxed"
                  >
                    <span className="text-orange-500 mt-1 font-bold select-none text-xs shrink-0 bg-orange-50 border border-orange-100 w-5 h-5 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span className="break-words">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-5 bg-slate-50 border border-purple-950/[0.03] rounded-[2rem] p-6 sm:p-8 space-y-6 lg:sticky lg:top-8 shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 block mb-2">
                Community Engagement
              </span>
              
              {/* Flex container for Volunteers & Supporters */}
              <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-purple-950/5 shadow-xs">
                {/* Volunteers Stat */}
                <div className="flex-1 text-center py-2.5 px-3 bg-slate-50/80 rounded-xl border border-purple-950/[0.04]">
                  <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                    {volunteersCount}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-950/50 block mt-0.5">
                    Volunteers
                  </span>
                </div>

                <div className="w-[1px] h-10 bg-purple-950/10" />

                {/* Supporters Stat */}
                <div className="flex-1 text-center py-2.5 px-3 bg-slate-50/80 rounded-xl border border-purple-950/[0.04]">
                  <div className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
                    {supportersCount}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-950/50 block mt-0.5">
                    Supporters
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-purple-950/5 pt-6 space-y-4">
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide mb-1.5">
                  Want to support this workflow?
                </h4>
                <p className="text-xs text-purple-950/50 font-medium leading-relaxed">
                  Every active initiative is propelled by shared knowledge, open
                  technical code contributions, and community participation.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleVolunteer}
                  disabled={hasVolunteered}
                  className={`w-full font-black py-4 px-6 rounded-xl text-center text-sm tracking-wide transition-all duration-300 transform ${
                    hasVolunteered
                      ? "bg-slate-200 text-purple-950/40 cursor-not-allowed border border-slate-300"
                      : "bg-purple-950 hover:bg-orange-500 text-white shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 hover:-translate-y-0.5 cursor-pointer"
                  }`}
                >
                  {hasVolunteered ? "Volunteered ✓" : "Participate as a Volunteer"}
                </button>

                <button
                  type="button"
                  onClick={handleBackInitiative}
                  disabled={hasBacked}
                  className={`w-full font-bold py-3.5 px-6 rounded-xl text-center text-sm transition-all duration-200 ${
                    hasBacked
                      ? "bg-slate-200 text-purple-950/40 cursor-not-allowed border border-slate-300"
                      : "bg-white hover:bg-purple-50 border border-purple-950/10 text-purple-950 hover:border-orange-500/20 shadow-xs cursor-pointer"
                  }`}
                >
                  {hasBacked ? "Initiative Backed ✓" : "Back This Initiative"}
                </button>
              </div>

              {(hasVolunteered || hasBacked) && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-green-600 bg-green-50 py-2 px-3 rounded-lg border border-green-100 text-center">
                    {hasVolunteered && hasBacked
                      ? "Thank you for volunteering and backing this initiative!"
                      : hasVolunteered
                      ? "You are registered as a volunteer!"
                      : "You have backed this initiative!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="text-center mt-16 pt-8 border-t border-purple-950/5">
          <Button
            text="View All Other Campaigns"
            to="/all-Campaign"
            className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-xl text-center text-sm tracking-wide shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default CampaignDetails;
