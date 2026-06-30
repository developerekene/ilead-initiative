import React from "react";

const ILeadBentoGrid: React.FC = () => {
    return (
        <section className="w-full max-w-6xl mx-auto my-24 px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-purple-950 tracking-tight">
                    The Architecture of <span className="text-orange-500">Empowerment</span>
                </h2>
                <p className="mt-4 text-purple-950/60 font-medium text-lg max-w-2xl mx-auto">
                    We combine real-world technical skills with collective human empathy to incubate structural long-term impact.
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[320px] gap-6">

                {/* Feature 1: Real-Time Intelligence (Wide - 2 Columns) */}
                <div className="md:col-span-2 rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative border border-purple-950/5 bg-slate-50 group hover:shadow-xl hover:shadow-purple-950/5 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-extrabold text-purple-950 mb-3">
                            Collective Talent Mapping
                        </h3>
                        <p className="text-sm md:text-base text-purple-950/60 font-medium leading-relaxed max-w-md">
                            Track growth indices, digital literacy metrics, and community project deployments across our global tech ecosystem instantly.
                        </p>
                    </div>
                    {/* Inline Chart Mock Visual */}
                    <div className="mt-6 flex items-flex-end gap-4 h-24 pl-4">
                        <div className="w-10 rounded-t-lg bg-orange-400 h-[40%] animate-[pulse_2s_infinite]" />
                        <div className="w-10 rounded-t-lg bg-purple-900 h-[80%] animate-[pulse_2.5s_infinite]" />
                        <div className="w-10 rounded-t-lg bg-orange-500 h-[60%] animate-[pulse_3s_infinite]" />
                    </div>
                </div>

                {/* Feature 2: Psychological Safety & Check-ins (Small - 1 Column) */}
                <div className="rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative bg-purple-950 text-white shadow-xl shadow-purple-950/10">
                    <div>
                        <h3 className="text-xl font-extrabold text-white mb-3">
                            Isolation Defenses
                        </h3>
                        <p className="text-sm text-orange-400 font-semibold leading-relaxed">
                            A safe network of continuous peer checks and direct collaborative workspace connections.
                        </p>
                    </div>
                    {/* Security Visual Area */}
                    <div className="flex justify-center items-center text-6xl h-24 select-none">
                        🤝
                    </div>
                </div>

                {/* Feature 3: Ecosystem Sharing Card (Vertical Tall - 1 Column, spans 2 rows) */}
                <div className="md:row-span-2 rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative border border-purple-950/5 bg-purple-50/50 group hover:shadow-xl hover:shadow-purple-950/5 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-extrabold text-purple-950 mb-3">
                            Viral Knowledge Drops
                        </h3>
                        <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
                            Pre-built digital resource bundles optimized for fast scaling on professional channels.
                        </p>
                    </div>
                    {/* Share Card Mock */}
                    <div className="mt-6 w-full h-40 bg-white rounded-2xl p-5 shadow-lg shadow-purple-950/5 border border-purple-100 flex flex-col justify-between">
                        <div>
                            <div className="h-2.5 bg-slate-100 rounded-sm w-full mb-2" />
                            <div className="h-2.5 bg-slate-100 rounded-sm w-2/3" />
                        </div>
                        <div className="mt-4 bg-orange-500 text-white text-xs font-black py-2.5 rounded-xl text-center tracking-wide select-none">
                            DISTRIBUTE SKILLS
                        </div>
                    </div>
                </div>

                {/* Feature 4: Strategic Bootcamps / Custom Logic (Wide - 2 Columns) */}
                <div className="md:col-span-2 rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative border border-purple-950/5 bg-orange-50/40 group hover:shadow-xl hover:shadow-purple-950/5 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-extrabold text-purple-950 mb-3">
                            Tailored Incubators
                        </h3>
                        <p className="text-sm md:text-base text-purple-950/60 font-medium leading-relaxed max-w-lg">
                            From basic mobile layouts to advanced cross-platform architectures. We adjust curriculum vectors based on current industry demands.
                        </p>
                    </div>
                    {/* Swatches Container Mock */}
                    <div className="mt-auto flex gap-3 flex-wrap">
                        <div className="bg-white border-2 border-purple-900 text-purple-900 px-4 py-2 rounded-xl font-bold text-xs tracking-wide">
                            React Native
                        </div>
                        <div className="bg-white border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-xl font-bold text-xs tracking-wide">
                            Product Strategy
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ILeadBentoGrid;