import React, { useState, useRef } from "react";

interface CertificateMetadata {
    fullName: string;
    credentialType: "instructor" | "learner";
    milestoneTrack: string;
    completionDate: string;
    authorizedHash: string;
    totalHours: number;
}

const ITrainCertificateGenerator: React.FC = () => {
    // Component Form State for testing dynamic generations
    const [metaData, setMetaData] = useState<CertificateMetadata>({
        fullName: "Ekene Okoli",
        credentialType: "learner",
        milestoneTrack: "CGPA Target Management & Strategic Study Habits",
        completionDate: "2026-06-03",
        authorizedHash: "0x8F3C...A9E2_iLEAD_SECURE_CERT",
        totalHours: 24
    });

    const [isGenerated, setIsGenerated] = useState<boolean>(true);
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMetaData(prev => ({ ...prev, [name]: value }));
    };

    // Auto-generate or mutate secure signature tokens upon changes
    const triggerGeneration = (e: React.FormEvent) => {
        e.preventDefault();
        const generatedHash = `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}_iLEAD_VERIFIED`;
        setMetaData(prev => ({ ...prev, authorizedHash: generatedHash }));
        setIsGenerated(true);
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white">

            {/* Left Column: Management & Meta Configuration Controls */}
            <div className="lg:col-span-4 bg-white border border-purple-950/10 rounded-[2rem] p-6 shadow-xl shadow-purple-950/[0.02]">
                <div className="mb-6">
                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
                        ITRAIN Core
                    </span>
                    <h2 className="text-xl font-black text-purple-950 tracking-tight mt-3">Certificate Engine</h2>
                    <p className="text-xs text-purple-950/50 font-medium mt-1">
                        Input milestone parameters to generate high-resolution, on-demand credential layers dynamically.
                    </p>
                </div>

                <form onSubmit={triggerGeneration} className="space-y-4">
                    {/* Full Name Configuration */}
                    <div>
                        <label className="text-xs font-bold text-purple-950/70 block mb-1">Recipient Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={metaData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Promise Amadi"
                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-2.5 text-sm text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Credential Categorization Type (AC: Distinguishes between paths accurately) */}
                    <div>
                        <label className="text-xs font-bold text-purple-950/70 block mb-1">Credential Pathway</label>
                        <select
                            name="credentialType"
                            value={metaData.credentialType}
                            onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-2.5 text-sm text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer font-medium"
                        >
                            <option value="learner">Graduate Learner Track</option>
                            <option value="instructor">Certified Instructor / Consultant</option>
                        </select>
                    </div>

                    {/* Milestone Track Field */}
                    <div>
                        <label className="text-xs font-bold text-purple-950/70 block mb-1">Milestone Description Track</label>
                        <input
                            type="text"
                            name="milestoneTrack"
                            required
                            value={metaData.milestoneTrack}
                            onChange={handleInputChange}
                            placeholder="e.g. University Entry Guidance Curriculum"
                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-2.5 text-sm text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Grid Columns for Hours and Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1">Log Metric (Hours)</label>
                            <input
                                type="number"
                                name="totalHours"
                                min="1"
                                value={metaData.totalHours}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-2.5 text-sm text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1">Issue Date</label>
                            <input
                                type="date"
                                name="completionDate"
                                value={metaData.completionDate}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-2.5 text-sm text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-950 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md"
                    >
                        Generate Secure Token Matrix
                    </button>
                </form>
            </div>

            {/* Right Column: Interactive Credential Canvas Blueprint View */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center">

                {isGenerated ? (
                    <div className="w-full max-w-2xl border-4 border-double border-purple-950/20 p-2 rounded-2xl bg-white shadow-2xl shadow-purple-950/5 select-none transition-all duration-500">

                        {/* Certificate Main Canvas Base Layout Framework */}
                        <div
                            ref={certificateRef}
                            className={`w-full aspect-[1.414/1] bg-white border border-purple-950/10 rounded-xl relative p-8 md:p-12 flex flex-col justify-between overflow-hidden`}
                        >
                            {/* Decorative Background Micro-Accents (Ensures White Context is Maintained) */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-purple-950/10 m-4 rounded-tl-lg pointer-events-none" />
                            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-purple-950/10 m-4 rounded-tr-lg pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-purple-950/10 m-4 rounded-bl-lg pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-purple-950/10 m-4 rounded-br-lg pointer-events-none" />

                            {/* Certificate Header Branding Blocks */}
                            <div className="text-center mt-2 z-10">
                                <span className="font-black text-lg tracking-widest text-purple-950 uppercase block">
                                    iLEAD ECOSYSTEM
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500 mt-0.5 block">
                                    Minds Impacting Minds Network
                                </span>
                            </div>

                            {/* Center Layout Container: Text Variable Blocks (AC: Safe sizing ensures no layout clipping) */}
                            <div className="text-center my-auto px-4 z-10">
                                <span className="text-[11px] font-black tracking-widest text-purple-950/40 uppercase block mb-3">
                                    This Document Formally Recognizes That
                                </span>

                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950 border-b border-purple-950/10 pb-2 max-w-md mx-auto truncate font-serif italic">
                                    {metaData.fullName || "Unspecified Recipient"}
                                </h3>

                                <p className="text-xs text-purple-950/70 font-medium max-w-lg mx-auto leading-relaxed mt-4">
                                    {metaData.credentialType === "instructor" ? (
                                        <>
                                            has acted as a verified <span className="text-purple-900 font-extrabold uppercase tracking-wide bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">Certified Instructor/Consultant</span> inside Knowledge City, contributing over <span className="font-bold text-purple-950 underline decoration-orange-500 decoration-2">{metaData.totalHours} hours</span> of direct educational consultation, grade strategy mentorship, and study habit support.
                                        </>
                                    ) : (
                                        <>
                                            has successfully completed the requirements for the <span className="text-orange-600 font-extrabold uppercase tracking-wide bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">Graduate Learner</span> tracking matrix within the core mentorship branch of
                                        </>
                                    )}
                                </p>

                                <h4 className="text-sm font-black text-purple-950 tracking-normal mt-3 max-w-xl mx-auto line-clamp-2">
                                    {metaData.milestoneTrack || "General Academic Development Track"}
                                </h4>
                            </div>

                            {/* Certificate Bottom Signatures & Verification Infrastructure Metadata Row */}
                            <div className="grid grid-cols-3 items-end text-center mt-2 z-10">

                                {/* Left Validation Anchor */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-purple-950/40 font-mono block select-all font-semibold">
                                        {metaData.completionDate}
                                    </span>
                                    <div className="w-20 h-px bg-purple-950/20 mt-1 mb-1" />
                                    <span className="text-[9px] uppercase tracking-wider text-purple-950/50 font-bold block">
                                        Date Conferred
                                    </span>
                                </div>

                                {/* Center Badge Seal Indicator Element */}
                                <div className="flex justify-center items-center">
                                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center bg-white shadow-sm transition-all duration-300 ${metaData.credentialType === 'instructor' ? 'border-purple-200' : 'border-orange-200'
                                        }`}>
                                        <span className={`text-base font-bold select-none ${metaData.credentialType === 'instructor' ? 'text-purple-900' : 'text-orange-500'
                                            }`}>
                                            {metaData.credentialType === 'instructor' ? '💼' : '🎓'}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Platform Signature Authorization */}
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] text-purple-950/60 font-mono block select-all bg-slate-50 border border-purple-950/5 px-1 py-0.5 rounded uppercase max-w-[120px] truncate">
                                        {metaData.authorizedHash}
                                    </span>
                                    <div className="w-20 h-px bg-purple-950/20 mt-1 mb-1" />
                                    <span className="text-[9px] uppercase tracking-wider text-purple-950/50 font-bold block">
                                        Auth Signature
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-purple-950/10 rounded-2xl w-full max-w-2xl">
                        <p className="text-sm text-purple-950/40 font-medium">Configure properties to verify dynamic layout metrics.</p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default ITrainCertificateGenerator;