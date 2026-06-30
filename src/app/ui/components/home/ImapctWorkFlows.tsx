import React from "react";
import { Link } from "react-router-dom";

const ImpactWorkflows: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto my-24 px-6 md:px-12 flex flex-col gap-24 md:gap-40 bg-white">

            {/* Row 1: The Incubation & Building Process */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
                <div className="flex-1 max-w-xl text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100">
                        iLEAD x Incubator
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 leading-none mt-4 mb-6">
                        From basic ideas to global real-world tools.
                    </h2>
                    <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed mb-8">
                        Whether you are a creator mapping out your first application architecture or a team looking to streamline real-world production setups, our ecosystem guides you from zero to production deployment.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-orange-500 hover:text-purple-900 font-extrabold text-base tracking-wide transition-colors group"
                    >
                        Access incubation spaces
                        <span className="transform group-hover:translate-x-1.5 transition-transform duration-200 ml-1">→</span>
                    </Link>
                </div>

                {/* Visual Interface Component Card */}
                <div className="w-full max-w-md flex-1">
                    <div className="bg-purple-50/40 p-8 rounded-[2rem] border border-purple-950/5 shadow-inner">
                        <div className="font-extrabold text-purple-950/40 text-xs uppercase tracking-wider mb-6 flex items-center justify-between">
                            <span>Project Hub Workflow</span>
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="bg-white p-5 rounded-2xl flex justify-between items-center border border-purple-950/5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-purple-400 font-medium text-sm">01</span>
                                    <span className="font-bold text-purple-950 text-sm sm:text-base">React Native Base Setup</span>
                                </div>
                                <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md">Compiled</span>
                            </div>

                            <div className="bg-white p-5 rounded-2xl flex justify-between items-center border-2 border-orange-500/30 shadow-md">
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-500 font-black text-sm">02</span>
                                    <span className="font-black text-purple-950 text-sm sm:text-base">Embed Global State Mechanics</span>
                                </div>
                                <span className="text-orange-500 font-extrabold text-xs bg-orange-50 px-2 rounded-md animate-pulse">Active</span>
                            </div>

                            <div className="bg-white p-5 rounded-2xl flex justify-between items-center border border-purple-950/5 shadow-sm opacity-60">
                                <div className="flex items-center gap-3">
                                    <span className="text-purple-300 font-medium text-sm">03</span>
                                    <span className="font-bold text-purple-950 text-sm sm:text-base">Production API Testing</span>
                                </div>
                                <span className="text-purple-400 text-xs font-semibold">Pending</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full py-3 border-2 border-dashed border-purple-950/10 hover:border-orange-500/30 bg-transparent text-purple-950/40 hover:text-orange-500 rounded-2xl font-bold text-sm transition-all duration-200">
                            + Connect Repository Pipeline
                        </button>
                    </div>
                </div>
            </div>

            {/* Row 2: Verification, Direct Support & Metrics Dashboard */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-24">
                <div className="flex-1 max-w-xl text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md border border-purple-100">
                        iLEAD Collective Safety
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 leading-none mt-4 mb-6">
                        No engineer or creator walks alone.
                    </h2>
                    <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed mb-8">
                        Isolation slows down true innovation. Our platform integrates deep peer accountability, continuous group workspace checks, and collective resource optimization structures built around collaborative support.
                    </p>
                    <Link
                        to="/all-causes"
                        className="inline-flex items-center text-purple-950 hover:text-orange-500 font-extrabold text-base tracking-wide transition-colors group"
                    >
                        Explore active causes
                        <span className="transform group-hover:translate-x-1.5 transition-transform duration-200 ml-1">→</span>
                    </Link>
                </div>

                {/* Dashboard Metrics Presentation Card */}
                <div className="w-full max-w-md flex-1">
                    <div className="bg-white border border-purple-950/10 rounded-[2rem] p-8 shadow-xl shadow-purple-950/5">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-extrabold text-purple-950 text-sm tracking-tight">Community Health Dashboard</span>
                            <span className="bg-emerald-50 text-emerald-600 font-bold text-xs px-3 py-1 rounded-full border border-emerald-100">
                                Live Metrics
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-950/5">
                                <span className="block text-xs font-bold text-purple-950/40 mb-1">Weekly Check-Ins</span>
                                <span className="text-2xl font-black text-purple-950 tracking-tight">1,840+</span>
                            </div>
                            <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-50/50">
                                <span className="block text-xs font-bold text-orange-950/50 mb-1">Growth Index</span>
                                <span className="text-2xl font-black text-orange-500 tracking-tight">98.4%</span>
                            </div>
                        </div>

                        {/* Interactive Growth Representation Blocks */}
                        <div className="flex flex-col gap-2.5">
                            <div className="w-full bg-purple-50 rounded-full h-3 overflow-hidden">
                                <div className="bg-purple-950 h-full rounded-full transition-all duration-500" style={{ width: '88%' }} />
                            </div>
                            <div className="w-full bg-orange-50 rounded-full h-3 overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: '64%' }} />
                            </div>
                            <div className="w-full bg-purple-50/40 rounded-full h-3 overflow-hidden">
                                <div className="bg-purple-300 h-full rounded-full transition-all duration-500" style={{ width: '40%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ImpactWorkflows;