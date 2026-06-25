import React from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import toast from "react-hot-toast";

interface CampaignSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onCreateClick: () => void;
}

const CampaignSearch: React.FC<CampaignSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to be signed in to create a campaign.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", { state: { from: location } });
      return;
    }
    onCreateClick();
  };
  return (
    <div className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-8">
      {/* Header & Search */}
      <div className="text-center mb-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 mb-4">
          Active Communities of <span className="text-orange-500">Impact</span>
        </h2>
        <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
          We don't just talk about change; we build it through hands-on
          interaction, deep strategic mentorship, and unconditional support.
          Explore our ongoing workflows.
        </p>
      </div>

      <div className="flex justify-end items-center gap-4 pt-6 px-6">
        <div className="relative w-full max-w-lg">
          <CiSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-950/40"
          />

          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3 rounded-xl border border-purple-950/10 bg-purple-50 text-purple-950 placeholder:text-purple-950/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-950/20"
          />
        </div>

        <button
          onClick={handleCreateClick}
          className="relative font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white shrink-0 group"
        >
          + Create a New Campaign
          {/* Tooltip shown only when logged out */}
          {!isLoggedIn && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-950 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Sign in to create a campaign
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CampaignSearch;
