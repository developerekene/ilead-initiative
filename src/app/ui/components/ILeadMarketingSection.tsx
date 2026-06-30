import React from 'react';

const ILeadMarketingSection: React.FC = () => {
    return (
        <section className="w-full bg-white text-purple-950 px-6 py-16 md:py-24 border-t border-purple-950/5 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">

                {/* UPPER GRID: STRATEGIC INTENT HEADER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-purple-950/5 pb-12">
                    <div className="lg:col-span-7 space-y-4">
                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
                            Global Network of Opportunities
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight pt-2">
                            Increase your visibility. Expand your opportunities. Unlock your potential.
                        </h2>
                    </div>
                    <div className="lg:col-span-5 lg:pt-8">
                        <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
                            iLead acts as a structured human engine designed to ground learners, creators, and professionals in sustainable growth platforms. We combine practical learning with deep industry access.
                        </p>
                    </div>
                </div>

                {/* CORE GRID ARCHITECTURE: CAPABILITIES VS WHY CHOOSE ILEAD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* LEFT CONTAINER: WHAT YOU CAN DO (7 Core Action Vectors) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">Ecosystem Capabilities</h3>
                            <h4 className="text-xl font-black tracking-tight mt-1">What You Can Do with iLead</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "Expert Learning Matrix", desc: "Absorb practical frameworks directly from experienced professionals and active industry leaders." },
                                { title: "Knowledge Architecture", desc: "Teach, mentor, and scale your personal domain expertise across a global audience footprint." },
                                { title: "Targeted iTrain Courses", desc: "Access practical, career-focused courses intentionally tailored around regional and African macroeconomic needs." },
                                { title: "Strategic Skillsets", desc: "Develop essential study habits and high-impact professional execution skills built for scale." },
                                { title: "Targeted Sync Support", desc: "Receive direct, actionable guidance to overcome critical university tracks and workspace roadblocks." },
                                { title: "Peer-to-Peer Intersect", desc: "Build meaningful human connections and systematically expand your active professional network." },
                                { title: "Multi-Sector Discovery", desc: "Unlock structural access across education, fashion, food, technology, and local entrepreneurship layers." }
                            ].map((capability, i) => (
                                <div
                                    key={i}
                                    className={`bg-slate-50/50 border border-purple-950/[0.02] p-5 rounded-2xl space-y-2 hover:bg-white hover:shadow-sm transition-all duration-200 ${i === 6 ? 'sm:col-span-2' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500 font-bold text-xs select-none bg-orange-50 border border-orange-100 w-5 h-5 rounded-md flex items-center justify-center shrink-0">✓</span>
                                        <h5 className="text-xs font-black text-purple-950 tracking-tight uppercase">{capability.title}</h5>
                                    </div>
                                    <p className="text-xs text-purple-950/70 font-semibold leading-relaxed pl-7">{capability.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTAINER: WHY CHOOSE US (High-Impact Values) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-8 bg-purple-950 text-white rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-8 shadow-xl shadow-purple-950/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12 pointer-events-none" />

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block mb-1">Operational Value</span>
                            <h4 className="text-2xl font-black tracking-tight">Why Choose iLead?</h4>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Practical learning experiences", icon: "🧠" },
                                { title: "Professional mentorship layers", icon: "🤝" },
                                { title: "Industry-relevant courses", icon: "📜" },
                                { title: "Global networking opportunities", icon: "🌐" },
                                { title: "Solutions for educational challenges", icon: "📈" }
                            ].map((value, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-white/5 border border-white/[0.03] p-4 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-9 h-9 bg-white/10 border border-white/5 rounded-lg flex items-center justify-center text-sm shrink-0">
                                        {value.icon}
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold tracking-tight text-white/90">
                                        {value.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[11px] text-white/50 font-medium leading-relaxed">
                                Join a coordinated blueprint powering continuous growth parameters across tech, business strategy, and community giving channels.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ILeadMarketingSection;