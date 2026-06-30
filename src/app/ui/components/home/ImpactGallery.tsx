import React from "react";
import { Link } from "react-router-dom";

interface AchievedCampaign {
    id: string;
    title: string;
    category: "Tech Mentorship" | "Business Strategy" | "Community Giving";
    reachMetric: {
        label: string;
        value: string;
    };
    narrative: {
        genesis: string;  // How we started
        resolution: string; // How it ended / what was achieved
    };
    impact: {
        individual: string; // Impact on the person
        community: string;  // Impact on the ecosystem
    };
}

const ACHIEVED_CAMPAIGNS: AchievedCampaign[] = [
    {
        id: "grassroots-literacy-2025",
        title: "The Grassroots Digital Literacy Drive",
        category: "Tech Mentorship",
        reachMetric: { label: "Engineers Mapped", value: "1,240+ Graduated" },
        narrative: {
            genesis: "Started with a broken laptop pool and 15 isolated builders trying to self-learn production engineering workflows without structural roadmaps.",
            resolution: "Evolved into a rigorous engineering incubator with complete localized mentorship pipelines and a verified open curriculum layer."
        },
        impact: {
            individual: "Aspiring developers from non-traditional backgrounds broke out of technical isolation and mastered production-grade React Native environments.",
            community: "Seeded local tech ecosystems with a highly capable talent tier ready to support home-grown digital infrastructure."
        }
    },
    {
        id: "founders-cohort-one",
        title: "SME Acceleration Cohort Alpha",
        category: "Business Strategy",
        reachMetric: { label: "SME Revenue Growth", value: "Avg +42% YoY" },
        narrative: {
            genesis: "Launched to address high failure rates among brilliant local creators who lacked access to scalable operations and financial projection frameworks.",
            resolution: "Delivered 450 hours of targeted, high-touch strategic review workshops, transforming informal ideas into auditable business setups."
        },
        impact: {
            individual: "Founders gained total mastery over their unit economics, shifting from chaotic day-to-day survival to confident, strategic expansion.",
            community: "Built an independent economic collective where local businesses trade skills, share operational data, and insulate each other from market shocks."
        }
    },
    {
        id: "hardware-circle-2025",
        title: "The Selfless Circle Infrastructure Pool",
        category: "Community Giving",
        reachMetric: { label: "Workstations Deployed", value: "84 Systems" },
        narrative: {
            genesis: "Began when we noticed elite engineering talents completely stalled because their personal hardware couldn't run modern mobile emulators smoothly.",
            resolution: "Established a zero-interest, crowd-fueled workspace fund that completely bypassed institutional gatekeepers to supply pro-tier setups."
        },
        impact: {
            individual: "Gave individual builders the computing capacity needed to build, compile, and ship complex software solutions without local hardware bottlenecks.",
            community: "Leveled the digital resource playing field, ensuring that structural poverty never limits technical genius within our workspace."
        }
    },
    {
        id: "mental-safety-net",
        title: "The \"You Are Not Alone\" Pilot",
        category: "Community Giving",
        reachMetric: { label: "Isolation Check-Ins", value: "3,200+ Hours" },
        narrative: {
            genesis: "Triggered by severe developer burnout and professional alienation creeping across isolated remote workers and indie builders.",
            resolution: "Deployed a continuous professional safety net featuring daily asynchronous catch-ups and localized workspace check-ins."
        },
        impact: {
            individual: "Engineers recovered their psychological safety, separating their human self-worth from strict production metrics and code output.",
            community: "Transformed an otherwise competitive, cold industry into a deeply human cooperative that looks out for its collective wellbeing."
        }
    },
    {
        id: "open-source-incubator",
        title: "Ecosystem Infrastructure Hackathon",
        category: "Tech Mentorship",
        reachMetric: { label: "Production Apps Live", value: "7 Core Utilities" },
        narrative: {
            genesis: "Conceived to transition junior developers from building standard generic tutorial components to owning real, live public applications.",
            resolution: "Brought teams together for a 48-hour sprint, yielding production-ready software solutions utilized by real community entities."
        },
        impact: {
            individual: "Junior devs gained true collaborative product experience—managing git conflicts, continuous integration pipelines, and strict QA standards.",
            community: "Provided open-source civic utilities to local groups, proving that community tech can solve community problems independently."
        }
    },
    {
        id: "capital-bridge-initiative",
        title: "The Angel Mentor Matchway",
        category: "Business Strategy",
        reachMetric: { label: "Seed Funding Routed", value: "£140k+ Raised" },
        narrative: {
            genesis: "Initiated because brilliant, underrepresented founders were consistently locked out of traditional angel networks and venture capital rooms.",
            resolution: "Constructed an alternative pitching layout that matched builders directly with seasoned operators based on raw execution data.",
        },
        impact: {
            individual: "Gave talented minority operators their first institutional runway without requiring they sacrifice core equity structures prematurely.",
            community: "Created an autonomous funding precedent, encouraging early leaders to immediately reinvest back into the next local builder wave."
        }
    }
];

const ImpactGallery: React.FC = () => {
    return (
        <section className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 py-24">

            {/* Section Header */}
            <div className="text-center mb-20 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 mb-4">
                    See What We Have <span className="text-orange-500">Achieved</span>
                </h2>
                <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
                    Real proof lives in execution, not promises. Here is how our finished workflows structurally re-engineered individual careers and broader tech ecosystems.
                </p>
            </div>

            {/* Core 6-Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                {ACHIEVED_CAMPAIGNS.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/5 hover:border-orange-500/10 group"
                    >
                        {/* Meta Category and High-Impact Counter */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-6 border-b border-purple-950/5">
                            <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
                                {campaign.category}
                            </span>
                            <div className="flex items-center gap-2 text-purple-950">
                                <span className="text-xs font-bold text-purple-950/50 uppercase tracking-wider">{campaign.reachMetric.label}:</span>
                                <span className="text-sm font-black bg-orange-500 text-white px-3 py-1 rounded-full tracking-tight">
                                    {campaign.reachMetric.value}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-purple-950 leading-tight mb-6 group-hover:text-purple-700 transition-colors duration-200">
                            {campaign.title}
                        </h3>

                        {/* Narrative Breakdown (Genesis -> Resolution) */}
                        <div className="space-y-4 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-purple-950/[0.02]">
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 block mb-1">How We Started</span>
                                <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                                    {campaign.narrative.genesis}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-purple-950/5">
                                <span className="text-[11px] font-black uppercase tracking-widest text-purple-900 block mb-1">How It Completed</span>
                                <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                                    {campaign.narrative.resolution}
                                </p>
                            </div>
                        </div>

                        {/* Impact Segregation Vector */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mb-8">
                            <div className="border-l-2 border-orange-500 pl-4">
                                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-1">Impact on the Person</h4>
                                <p className="text-xs text-purple-950/60 font-medium leading-relaxed">
                                    {campaign.impact.individual}
                                </p>
                            </div>
                            <div className="border-l-2 border-purple-900 pl-4">
                                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-1">Impact on the Community</h4>
                                <p className="text-xs text-purple-950/60 font-medium leading-relaxed">
                                    {campaign.impact.community}
                                </p>
                            </div>
                        </div>

                        {/* Static Bottom Action Strip */}
                        <div className="pt-4 border-t border-purple-950/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-950/40 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Verified Milestone
                            </span>
                            <Link
                                to={`/archive/${campaign.id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-black text-purple-950 hover:text-orange-500 transition-colors uppercase tracking-widest"
                            >
                                Case Study
                                <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ecosystem CTA Footer */}
            <div className="mt-20 text-center bg-purple-950 rounded-[2.5rem] p-10 md:p-16 text-white shadow-xl shadow-purple-950/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                <h3 className="text-2xl sm:text-3xl font-black mb-4">Be Part of the Next Success Story</h3>
                <p className="text-sm sm:text-base text-purple-200 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
                    We turn deep isolation into active engineering platforms. Lend your React Native, design, or business leadership skill sets today.
                </p>
                <Link
                    to="/community"
                    className="inline-block bg-orange-500 hover:bg-white text-white hover:text-purple-950 font-black px-8 py-4 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Contribute Your Skills
                </Link>
            </div>
        </section>
    );
};

export default ImpactGallery;