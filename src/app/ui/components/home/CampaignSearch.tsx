import React from "react";

interface CampaignSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const CampaignSearch: React.FC<CampaignSearchProps> = ({
  searchQuery,
  setSearchQuery,
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

      <div className="flex justify-end pt-12 px-6">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg px-5 py-3 rounded-xl border border-purple-950/10 bg-purple-50 text-purple-950 placeholder:text-purple-950/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-950/20"
        />
      </div>
    </div>
  );
};

export default CampaignSearch;
