import React, { useState, useMemo } from "react";

// Types corresponding to the ITRAIN core framework metadata structures
interface Consultant {
    id: string;
    name: string;
    role: string;
    institution: string;
    expertise: ("University Know-How" | "CGPA Strategies" | "Career Path Guidance" | "Study Habits")[];
    impactHours: number;
    avatar: string;
    bio: string;
    isVerified: boolean;
}

const MOCK_CONSULTANTS: Consultant[] = [
    {
        id: "consultant-1",
        name: "Dr. Arinze Okoye",
        role: "Academic Path Advisor",
        institution: "Imperial College London Alum",
        expertise: ["University Know-How", "CGPA Strategies"],
        impactHours: 450,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        bio: "Specializing in transition architectures for upcoming undergraduate STEM students looking to protect their cumulative track metrics early.",
        isVerified: true
    },
    {
        id: "consultant-2",
        name: "Sarah Jenkins",
        role: "Strategic Learning Consultant",
        institution: "Independent Coach",
        expertise: ["Study Habits", "Career Path Guidance"],
        impactHours: 320,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        bio: "Helping secondary school students build hyper-focused study systems and make long-term discipline choices before college applications open.",
        isVerified: true
    },
    {
        id: "consultant-3",
        name: "David Vance",
        role: "Admissions Operations Expert",
        institution: "Oxford Strategy Mentor",
        expertise: ["University Know-How", "Career Path Guidance"],
        impactHours: 610,
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
        bio: "Demystifying university interview systems and entry selections. Dedicated to guiding community builders toward high-leverage degrees.",
        isVerified: true
    },
    {
        id: "consultant-4",
        name: "Chidi Nwachukwu",
        role: "Grade Recovery Strategist",
        institution: "Ecosystem Educator",
        expertise: ["CGPA Strategies", "Study Habits"],
        impactHours: 180,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        bio: "Focused purely on grade calculation strategies and reverse-engineering study regimens to repair sliding performance indexes.",
        isVerified: true
    }
];

const EXPERTISE_FILTERS = [
    "University Know-How",
    "CGPA Strategies",
    "Career Path Guidance",
    "Study Habits"
] as const;

const ConsultantDirectory: React.FC = () => {
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // Dynamic Filter Toggle Handler
    const handleFilterToggle = (filter: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    // Client-side execution layer filtering data without structural page refresh
    const filteredConsultants = useMemo(() => {
        return MOCK_CONSULTANTS.filter((consultant) => {
            const matchesSearch = consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                consultant.role.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilters = selectedFilters.length === 0 ||
                selectedFilters.every((f) => consultant.expertise.includes(f as any));

            return matchesSearch && matchesFilters;
        });
    }, [searchQuery, selectedFilters]);

    // Reusable Inside Filter Component to eliminate code duplication
    const FilterContent = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                    Filter by Competency
                </h4>
                <div className="flex flex-col gap-2.5">
                    {EXPERTISE_FILTERS.map((filter) => {
                        const isChecked = selectedFilters.includes(filter);
                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => handleFilterToggle(filter)}
                                className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${isChecked
                                        ? "bg-purple-950 text-white border-purple-950 shadow-md"
                                        : "bg-slate-50 border-purple-950/5 text-purple-950/70 hover:bg-purple-50"
                                    }`}
                            >
                                <span>{filter}</span>
                                {isChecked && (
                                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedFilters.length > 0 && (
                <button
                    onClick={() => setSelectedFilters([])}
                    className="w-full text-center text-xs font-bold text-orange-500 hover:text-purple-950 transition-colors uppercase tracking-wider"
                >
                    Clear Active Filters ({selectedFilters.length})
                </button>
            )}
        </div>
    );

    return (
        <section className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 py-12">

            {/* Header Block */}
            <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                    Consultant <span className="text-orange-500">Directory</span>
                </h2>
                <p className="text-sm sm:text-base text-purple-950/50 font-medium mt-1">
                    Connect with verified academic minds to map out your grades, trajectory, and focus.
                </p>
            </div>

            {/* Global Search and Layout Control Strip */}
            <div className="flex gap-4 items-center mb-8">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-purple-950/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search consultants by name or specialty focus..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-950/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner shadow-purple-950/[0.01]"
                    />
                </div>

                {/* Mobile Filter Toggle Trigger */}
                <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="md:hidden mobile-toggle-btn p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-950 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors"
                    aria-label="Open Filter Engine"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </button>
            </div>

            {/* Split Screen Master Directory Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative">

                {/* Desktop Left Sidebar: Sticky Filter Deck */}
                <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-white border border-purple-950/5 rounded-[2rem] p-6 sticky top-24 shadow-sm shadow-purple-950/[0.02]">
                    <FilterContent />
                </aside>

                {/* Main Directory Output Column */}
                <main className="md:col-span-8 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {filteredConsultants.length > 0 ? (
                        filteredConsultants.map((consultant) => (
                            <div
                                key={consultant.id}
                                className="bg-white border border-purple-950/5 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/5 hover:border-orange-500/10 group"
                            >
                                <div>
                                    {/* Card Identity Header Layout */}
                                    <div className="flex gap-4 items-start mb-5">
                                        <div className="relative shrink-0">
                                            <img
                                                src={consultant.avatar}
                                                alt={consultant.name}
                                                className="w-14 h-14 rounded-2xl object-cover border border-purple-950/5"
                                            />
                                            {consultant.isVerified && (
                                                <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1 border-2 border-white flex items-center justify-center shadow-sm" title="Verified iTrain Professional">
                                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-purple-950 leading-snug group-hover:text-purple-700 transition-colors">
                                                {consultant.name}
                                            </h3>
                                            <p className="text-xs font-bold text-purple-950/40 tracking-wide uppercase mt-0.5">
                                                {consultant.role}
                                            </p>
                                            <p className="text-xs text-purple-950/60 font-medium">
                                                {consultant.institution}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description Bio Block */}
                                    <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-6">
                                        {consultant.bio}
                                    </p>

                                    {/* Competency Badge Badges Array */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {consultant.expertise.map((exp) => (
                                            <span
                                                key={exp}
                                                className="text-[10px] font-black tracking-wider uppercase bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100"
                                            >
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Statistics Block & Intake Execution Button */}
                                <div className="pt-4 border-t border-purple-950/5 flex items-center justify-between gap-4 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-purple-950/40 uppercase tracking-wider">Impact Counter</span>
                                        <span className="text-xs font-black text-purple-950 bg-slate-50 border border-purple-950/5 px-2 py-0.5 rounded-md mt-0.5 inline-block w-max">
                                            {consultant.impactHours} hrs gifted
                                        </span>
                                    </div>
                                    <button className="bg-purple-950 hover:bg-orange-500 text-white font-black py-2.5 px-4 rounded-xl text-xs tracking-wide shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5">
                                        Request Consultation
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-purple-950/10">
                            <p className="text-sm font-semibold text-purple-950/40">
                                No consultants match your current combination of search terms or competencies.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer Overlay Layer */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex justify-end">
                    {/* Backing Blur Blockout */}
                    <div
                        className="absolute inset-0 bg-purple-950/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />

                    {/* Sliding Context Drawer */}
                    <div className="relative w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-purple-950/5 mb-6">
                                <h3 className="font-black text-base text-purple-950 tracking-tight">Directory Filters</h3>
                                <button
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-purple-950 font-bold focus:outline-none cursor-pointer hover:bg-orange-50"
                                >
                                    ✕
                                </button>
                            </div>
                            <FilterContent />
                        </div>

                        <button
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className="w-full bg-orange-500 text-white font-black py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
                        >
                            Apply Active Settings
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ConsultantDirectory;