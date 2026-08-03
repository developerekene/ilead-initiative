// src/components/campaigncomponents/Campaigns.tsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";
import { useSelector } from "react-redux";
import { type Campaign } from "../../../redux/slices/campaignSlice";
import { RootState } from "../../../redux/store";

interface CampaignsProps {
  campaigns?: Campaign[];
  showViewAll?: boolean;
  searchQuery?: string;
  showHeader?: boolean;
  allowEdit?: boolean;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (id: string) => void;
}

const Campaigns: React.FC<CampaignsProps> = ({
  campaigns: campaignList,
  showViewAll = true,
  searchQuery = "",
  showHeader = true,
  allowEdit = false,
  onEdit,
  onDelete,
}) => {
  const allCampaignsFromStore = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );
  const campaignsToDisplay = campaignList ?? allCampaignsFromStore;

  const filteredCampaigns = campaignsToDisplay.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <section className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-16">
        {showHeader && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 mb-4">
              Active Communities of{" "}
              <span className="text-orange-500">Impact</span>
            </h2>
            <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
              We don't just talk about change; we build it through hands-on
              interaction, deep strategic mentorship, and unconditional support.
              Explore our ongoing workflows.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white border border-purple-950/5 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/5 hover:border-orange-500/20 group"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
                    {campaign.category}
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {campaign.statusBadge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-purple-950 leading-snug mb-4 group-hover:text-purple-700 transition-colors duration-200 break-words">
                  {campaign.title}
                </h3>

                <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed mb-8 break-words line-clamp-3">
                  {campaign.description}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center pt-5 border-t border-purple-950/5 mb-6 text-sm">
                  {campaign.category === "Election" ? (
                    <>
                      <span className="text-purple-950/50 font-medium truncate">
                        Candidates
                      </span>
                      <span className="text-purple-950 font-black tracking-tight bg-purple-50/50 px-2.5 py-1 rounded-md">
                        {campaign.candidates?.length || 0} Registered
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-purple-950/50 font-medium truncate">
                        Community Reach
                      </span>
                      <span className="text-purple-950 font-black tracking-tight bg-purple-50/50 px-2.5 py-1 rounded-md">
                        {(campaign.volunteersCount ?? campaign.volunteeredBy?.length ?? 0) +
                          (campaign.supportersCount ?? campaign.backedBy?.length ?? 0)}{" "}
                        Active
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Link
                    to={campaign.category === "Election" ? `/all-Campaign/election-details/${campaign.id}` : `/all-Campaign/campaign-details/${campaign.id}`}
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-200"
                  >
                    View Campaign
                  </Link>
                  {allowEdit && onEdit && onDelete && (
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => onEdit(campaign)}
                        className="flex-1 bg-white border border-purple-950/10 hover:bg-orange-50 text-purple-950 font-bold py-2 px-4 rounded-xl text-center text-sm transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(campaign.id)}
                        className="flex-1 bg-white border border-red-500/20 hover:bg-red-50 text-red-600 font-bold py-2 px-4 rounded-xl text-center text-sm transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-20 text-purple-950/40 font-medium">
              No campaigns found for "{searchQuery}"
            </div>
          )}
        </div>
        {showViewAll && (
          <div className="text-center  mt-12">
            <Button
              text="View all Campaigns"
              to="/all-Campaign"
              className=" bg-purple-950 hover:bg-orange-500 text-white  hover:shadow-orange-500/10 font-black rounded-xl"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Campaigns;
