import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import type { Campaign } from "../../redux/slices/campaignSlice";

/* ─── localStorage helpers ─────────────────────────── */

const STORAGE_KEY = "ilead_saved_campaigns";

const getSavedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const toggleSaved = (id: string): string[] => {
  const ids = getSavedIds();
  const updated = ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/* ─── Category badge colors ────────────────────────── */

const CATEGORY_STYLES: Record<string, string> = {
  "Tech Mentorship": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Business Strategy": "bg-blue-50 text-blue-700 border-blue-200",
  "Community Giving": "bg-purple-50 text-purple-700 border-purple-200",
  Election: "bg-amber-50 text-amber-700 border-amber-200",
};

/* ─── Component ────────────────────────────────────── */

const SavedCampaign: React.FC = () => {
  const allCampaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );

  const [savedIds, setSavedIds] = React.useState<string[]>(getSavedIds);
  const [removedId, setRemovedId] = React.useState<string | null>(null);

  const savedCampaigns = allCampaigns.filter((c) => savedIds.includes(c.id));

  const handleUnsave = (id: string) => {
    const updated = toggleSaved(id);
    setSavedIds(updated);
    setRemovedId(id);
    setTimeout(() => setRemovedId(null), 2000);
  };

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Saved Campaigns
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Your <span className="text-orange-500">Bookmarked</span> Campaigns
            </h1>
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-3xl">
              Campaigns you've saved for quick access. Bookmark campaigns from
              the main campaign page to see them here.
            </p>
          </div>
          <div className="lg:col-span-4 lg:pt-14 flex justify-center lg:justify-end">
            <div className="bg-slate-50/60 border border-purple-950/[0.03] rounded-2xl p-5 sm:p-6 text-center space-y-2">
              <span className="text-3xl font-black text-purple-950">
                {savedCampaigns.length}
              </span>
              <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                Saved Campaign{savedCampaigns.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIST ─── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {savedCampaigns.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <span className="text-5xl block">🔖</span>
            <h2 className="text-xl font-black text-purple-950">
              No saved campaigns
            </h2>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              Browse campaigns and save the ones that matter to you. They'll
              appear here for quick access.
            </p>
            <Link
              to="/all-Campaign"
              className="inline-flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg mt-4"
            >
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCampaigns.map((campaign) => {
              const catStyle =
                CATEGORY_STYLES[campaign.category] ??
                "bg-slate-50 text-slate-700 border-slate-200";
              const isRemoved = removedId === campaign.id;

              return (
                <div
                  key={campaign.id}
                  className={`bg-white border rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                    isRemoved
                      ? "border-red-200 opacity-50"
                      : "border-purple-950/5 hover:border-orange-500/20 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${catStyle}`}
                      >
                        {campaign.category}
                      </span>
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        {campaign.statusBadge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-purple-950 leading-snug mb-3 group-hover:text-purple-700 transition-colors break-words">
                      {campaign.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-6 break-words line-clamp-3">
                      {campaign.description}
                    </p>
                  </div>

                  <div>
                    {/* Metric */}
                    <div className="flex justify-between items-center pt-4 border-t border-purple-950/5 mb-4 text-xs">
                      <span className="text-purple-950/50 font-medium truncate">
                        {campaign.metricLabel}
                      </span>
                      <span className="text-purple-950 font-black bg-purple-50/50 px-2 py-1 rounded-md">
                        {campaign.metricValue}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link
                        to={
                          campaign.category === "Election"
                            ? `/all-Campaign/election-details/${campaign.id}`
                            : `/all-Campaign/campaign-details/${campaign.id}`
                        }
                        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
                      >
                        View Campaign
                      </Link>
                      <button
                        onClick={() => handleUnsave(campaign.id)}
                        className="w-full bg-white border border-purple-950/10 hover:border-red-300 hover:bg-red-50 text-purple-950/60 hover:text-red-600 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
                      >
                        {isRemoved ? "Removed" : "Unsave"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default SavedCampaign;
