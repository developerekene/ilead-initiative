import React from "react";

const PrivacyPolicy: React.FC = () => {
    const lastUpdated = "June 25, 2026";

    const policySections = [
        {
            index: "01",
            title: "Data Collection Parameters",
            subtitle: "Information We Core-Capture",
            desc: "To effectively manage membership directories and coordinate cohort logistics, we securely ingest specific profile datasets. This includes identifiable contact data (such as full names and email addresses) alongside specialized program metrics like academic indices (CGPA tracking records), video record vault metadata, and self-study track inputs."
        },
        {
            index: "02",
            title: "Operational Data Utilization",
            subtitle: "How Your Metrics Move",
            desc: "We completely reject abstract tracking models. Your data is used exclusively to fuel the live platform logic: managing mentorship cohort tiers, organizing local business outreach metrics, verifying contribution ranks for community givers, and processing resource deployment requests (such as matching needs with active offers)."
        },
        {
            index: "03",
            title: "Third-Party & Pipeline Policy",
            subtitle: "Data Distribution Restrictions",
            desc: "iLead does not sell, lease, or distribute your identity architecture to marketing syndicates. Data sharing is limited strictly to necessary system functions: facilitating secure background workflows via cloud storage (such as Firebase auth and DB integrations) and displaying authorized metrics within your internal community profile page."
        },
        {
            index: "04",
            title: "Hardware & Capital Foundations",
            subtitle: "The Equipment Fund Ingest",
            desc: "Members applying for zero-interest hardware assets or micro-financing layers via our Equipment Fund will undergo transparent administrative reviews. Financial documentation and status verifications are handled with strict operational access control and are reviewed only by authorized platform management."
        },
        {
            index: "05",
            title: "System Rights & Data Control",
            subtitle: "Managing Your Workspace Parameters",
            desc: "You maintain permanent ownership over your technical parameters. At any time, you can modify your core account variables directly via your main user workspace dashboard, or request complete removal of your profile history from our active directory by contacting the system controllers."
        }
    ];

    return (
        <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">

            {/* SECTION 1: HEADER STRATEGIC DECLARATION */}
            <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-4">
                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
                            Legal Framework
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
                            Privacy & Data Architecture Policy
                        </h1>
                    </div>
                    <div className="lg:col-span-4 lg:pt-14 text-center lg:text-right">
                        <div className="inline-block bg-slate-50 border border-purple-950/5 p-4 rounded-2xl text-left">
                            <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">Document Version</span>
                            <span className="text-xs font-bold text-purple-950 block mt-0.5">Last Updated: {lastUpdated}</span>
                            <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100/30 inline-block mt-2">Active Protocol</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECTION 2: THE PRIMARY POLICY MATRIX */}
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12">

                {/* OPENING MANDATE STATEMENT */}
                <div className="bg-orange-50/40 border border-orange-200/40 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-950/[0.01] rounded-bl-full pointer-events-none" />
                    <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider">Ecosystem Data Commitment</h3>
                    <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                        At iLead, we construct clean, high-utility technical solutions without reliance on intrusive tracker profiles or futuristic automation hype. This document outlines how our management layers systematically store, safeguard, and interface with your personal indicators to maintain an unblocked talent workspace.
                    </p>
                </div>

                {/* RECURSIVE POLICY PARSING ENGINE */}
                <div className="space-y-10">
                    {policySections.map((section) => (
                        <div
                            key={section.index}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start pt-8 border-t border-purple-950/5 group"
                        >
                            {/* INDEX TRACKING NODE */}
                            <div className="md:col-span-4 flex items-center md:items-start gap-3">
                                <span className="text-xs font-bold font-mono text-orange-500 bg-orange-50 border border-orange-100 rounded px-2 py-0.5 shrink-0 select-none">
                                    {section.index}
                                </span>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black text-purple-950 uppercase tracking-tight">
                                        {section.title}
                                    </h4>
                                    <span className="text-[10px] text-purple-950/40 font-bold uppercase tracking-wider block">
                                        {section.subtitle}
                                    </span>
                                </div>
                            </div>

                            {/* CLAUSE BODY EXPLANATION */}
                            <div className="md:col-span-8">
                                <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                                    {section.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* SECTION 3: SYSTEM CONTROLLER FOOTER CONTACT */}
            <footer className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
                <div className="bg-purple-950 text-white rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />

                    <div className="max-w-2xl mx-auto space-y-2">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block">Data Governance Contact</span>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            Have Questions Regarding Data Ingestion?
                        </h3>
                        <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed pt-1">
                            For immediate questions regarding your profile vectors, technical records deletion logs, or operational compliance parameters, reach out directly to the management office at our primary domain asset workspace.
                        </p>
                    </div>

                    <div className="pt-2">
                        <span className="inline-block bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-tight text-orange-400">
                            operations@ekenedilichukwu.com
                        </span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default PrivacyPolicy;