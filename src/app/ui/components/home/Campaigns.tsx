import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

// In-file typed dataset mirroring iLEAD's active giving, tech mentorship, and business strategy tracks
interface Campaign {
  id: string;
  title: string;
  category: "Tech Mentorship" | "Business Strategy" | "Community Giving";
  description: string;
  metricLabel: string;
  metricValue: string;
  statusBadge: string;
}

const ILEAD_CAMPAIGNS: Campaign[] = [
  {
    id: "you-are-not-alone-2026",
    title: 'The "You Are Not Alone" Network',
    category: "Community Giving",
    description:
      "Providing proactive professional check-ins, direct technical workspace assistance, and collaborative safety nets for engineers breaking out of extreme isolation.",
    metricLabel: "Active Peers Connected",
    metricValue: "850+ Members",
    statusBadge: "Always Open",
  },
  {
    id: "business-bootcamp",
    title: "SME & Founders Strategic Acceleration",
    category: "Business Strategy",
    description:
      "Breaking down financial planning, scalable team operations, and market positioning for local creators trying to build sustainable businesses.",
    metricLabel: "Mentorship Hours Gifted",
    metricValue: "450 hrs",
    statusBadge: "In Progress",
  },
  {
    id: "peer-support-fund",
    title: "The Selfless Circle Equipment Fund",
    category: "Community Giving",
    description:
      "A zero-interest, crowd-fueled collective pool helping community members purchase modern laptops and essential remote working setups.",
    metricLabel: "Laptops Provided",
    metricValue: "84 Systems",
    statusBadge: "Active Support",
  },
];

const Campaigns: React.FC = () => {
  return (
    <div>
      <section className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 py-24">
        {/* Section Header */}
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

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {ILEAD_CAMPAIGNS.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white border border-purple-950/5 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/5 hover:border-orange-500/20 group"
            >
              <div>
                {/* Card Meta Header */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
                    {campaign.category}
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {campaign.statusBadge}
                  </span>
                </div>

                {/* Campaign Typography */}
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 leading-snug mb-4 group-hover:text-purple-700 transition-colors duration-200">
                  {campaign.title}
                </h3>

                <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed mb-8">
                  {campaign.description}
                </p>
              </div>

              {/* Bottom Actions & Community Vital Statistics */}
              <div>
                <div className="flex justify-between items-center pt-5 border-t border-purple-950/5 mb-6 text-sm">
                  <span className="text-purple-950/50 font-medium">
                    {campaign.metricLabel}
                  </span>
                  <span className="text-purple-950 font-black tracking-tight bg-purple-50/50 px-2.5 py-1 rounded-md">
                    {campaign.metricValue}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    to={`/campaign-details/${campaign.id}`}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-200"
                  >
                    View
                  </Link>
                  <Link
                    to="/community"
                    className="flex-[2] bg-purple-950 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl text-center text-sm shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-200"
                  >
                    Participate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center  mt-12">
          <Button
            text="View all Campaigns"
            to="/campaigns"
            className=" bg-purple-950 hover:bg-orange-500 text-white  hover:shadow-orange-500/10 font-black rounded-xl"
          />
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
