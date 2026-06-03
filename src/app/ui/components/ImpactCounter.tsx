import React, { useState, useEffect } from "react";

// Mock interface mirroring real-time database inputs for the component state
interface ImpactData {
    role: "student" | "consultant" | "dual";
    hoursLearned: number;
    hoursConsulted: number;
    mindsImpacted: number;
}

const ImpactCounter: React.FC = () => {
    const [impact, setImpact] = useState<ImpactData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Simulated API fetch capturing the user's dynamic metrics from the iLearn backend state
    useEffect(() => {
        const fetchImpactStats = async () => {
            try {
                setLoading(true);
                // Simulating database network roundtrip latency
                await new Promise((resolve) => setTimeout(resolve, 800));
                
                setImpact({
                    role: "dual", // Change to "student" or "consultant" to view varied single dashboard tracks
                    hoursLearned: 42,
                    hoursConsulted: 18,
                    mindsImpacted: 114
                });
            } catch (error) {
                console.error("Failed to compile iLearn dynamic metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImpactStats();
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-white border border-purple-950/5 rounded-[2rem] p-8 animate-pulse flex flex-col gap-4 min-h-[160px]">
                <div className="h-4 bg-purple-950/10 rounded w-1/3" />
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="h-12 bg-purple-950/5 rounded-xl" />
                    <div className="h-12 bg-purple-950/5 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!impact) return null;

    return (
        <div className="w-full bg-white border border-purple-950/5 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-purple-950/[0.02] hover:border-orange-500/10 transition-all duration-300 group">
            
            {/* Widget Context Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-black text-purple-950 uppercase tracking-widest">
                        iLearn Platform Footprint
                    </h3>
                    <p className="text-xs text-purple-950/50 font-medium mt-0.5">
                        Your verified live contribution metric array.
                    </p>
                </div>
                <span className="text-[10px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
                    Live Metric
                </span>
            </div>

            {/* Dynamic Scannable Layout Metrics Wrapper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 w-full">
                
                {/* TRACK 1: LEARNER METRICS (Rendered for Students and Dual Profiles) */}
                {(impact.role === "student" || impact.role === "dual") && (
                    <div className="flex-1 bg-slate-50/50 border border-purple-950/[0.02] p-5 rounded-2xl hover:bg-purple-50/40 transition-colors duration-200 cursor-default relative overflow-hidden group/metric">
                        <span className="text-xs font-bold text-purple-950/50 block mb-1">
                            Hours Learned
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl md:text-4xl font-black text-purple-950 tracking-tight transition-transform duration-200 inline-block group-hover/metric:scale-105 origin-left">
                                {impact.hoursLearned}
                            </span>
                            <span className="text-xs font-bold text-purple-950/40">hrs</span>
                        </div>
                        {/* Interactive Micro-hover tooltip feature */}
                        <div className="absolute bottom-2 right-4 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-200 text-[10px] font-black text-purple-900 uppercase tracking-wider">
                            Study Target Achieved
                        </div>
                    </div>
                )}

                {/* TRACK 2: CONSULTANT METRICS - MINDS IMPACTED (Rendered for Consultants and Dual Profiles) */}
                {(impact.role === "consultant" || impact.role === "dual") && (
                    <div className="flex-1 bg-slate-50/50 border border-purple-950/[0.02] p-5 rounded-2xl hover:bg-orange-50/30 transition-colors duration-200 cursor-default relative overflow-hidden group/metric">
                        <span className="text-xs font-bold text-purple-950/50 block mb-1">
                            Minds Impacted
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl md:text-4xl font-black text-orange-500 tracking-tight transition-transform duration-200 inline-block group-hover/metric:scale-105 origin-left">
                                {impact.mindsImpacted}
                            </span>
                            <span className="text-xs font-bold text-orange-500/50">Students</span>
                        </div>
                        <div className="absolute bottom-2 right-4 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-200 text-[10px] font-black text-orange-500 uppercase tracking-wider">
                            Showing How to Fish
                        </div>
                    </div>
                )}

                {/* TRACK 3: CONSULTANT METRICS - HOURS CONSULTED (Rendered for Consultants and Dual Profiles) */}
                {(impact.role === "consultant" || impact.role === "dual") && (
                    <div className="flex-1 bg-slate-50/50 border border-purple-950/[0.02] p-5 rounded-2xl hover:bg-purple-50/40 transition-colors duration-200 cursor-default relative overflow-hidden group/metric">
                        <span className="text-xs font-bold text-purple-950/50 block mb-1">
                            Hours Consulted
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl md:text-4xl font-black text-purple-950 tracking-tight transition-transform duration-200 inline-block group-hover/metric:scale-105 origin-left">
                                {impact.hoursConsulted}
                            </span>
                            <span className="text-xs font-bold text-purple-950/40">hrs</span>
                        </div>
                        <div className="absolute bottom-2 right-4 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-200 text-[10px] font-black text-purple-900 uppercase tracking-wider">
                            Expert Guidance Gifted
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ImpactCounter;