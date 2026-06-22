import React from "react";
import { CiSearch } from "react-icons/ci";

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
  return (
    <div className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 py-24">
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

      <div className="flex justify-end items-center gap-4 pt-12 px-6">
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
          onClick={onCreateClick}
          className=" font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-200  bg-orange-500 hover:bg-orange-600 text-white"
        >
          + Create a New Campaign
        </button>
      </div>
    </div>
  );
};

export default CampaignSearch;
