import React, { useState } from "react";

interface ProfessionalApplicant {
    id: string;
    fullName: string;
    email: string;
    targetExpertise: string;
    bioDescription: string;
    institution: string;
    transcriptFileName: string;
    submissionDate: string;
}

const AdminVerificationPanel: React.FC = () => {
    // Simulating systemic authentication context status variables
    const [currentUserRole] = useState<"ADMIN" | "USER" | "CONSULTANT">("ADMIN");

    // Sample database payload array tracking pending professional validation models
    const [applicants, setApplicants] = useState<ProfessionalApplicant[]>([
        {
            id: "APP-2026-081",
            fullName: "Dr. Arinze Okafor",
            email: "arinze.o@university-hub.edu",
            targetExpertise: "University Entry Know-How & Focus Calibration",
            bioDescription: "Former academic admissions counselor with 8+ years guiding engineering candidates through competitive enrollment frameworks and high-tier academic tracking.",
            institution: "University of Oxford (Alumni)",
            transcriptFileName: "Okafor_Academic_Credentials_MSc.pdf",
            submissionDate: "2026-06-01"
        },
        {
            id: "APP-2026-084",
            fullName: "Sarah Jenkins",
            email: "s.jenkins@habits-consulting.co.uk",
            targetExpertise: "Study Habits & CGPA Target Management",
            bioDescription: "Educational psychologist specializing in cognitive behavioral study routines, active recall schedules, and structural GPA optimization models for undergraduate branches.",
            institution: "Cambridge Education Institute",
            transcriptFileName: "Jenkins_Psychology_Board_Cert.pdf",
            submissionDate: "2026-06-02"
        }
    ]);

    const [selectedApplicant, setSelectedApplicant] = useState<ProfessionalApplicant | null>(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionFeedback, setRejectionFeedback] = useState("");
    const [systemNotification, setSystemNotification] = useState<string | null>(null);

    // CRITERIA SAFETY INTERCEPT: Absolute routing roadblock if user role profile lacks administrative tokens
    if (currentUserRole !== "ADMIN") {
        return (
            <main className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-4 text-rose-500 font-bold text-xl">
                    ⚠️
                </div>
                <h1 className="text-xl font-black text-purple-950 tracking-tight">Security Access Intercepted</h1>
                <p className="text-xs text-purple-950/50 font-medium max-w-sm mt-1.5 leading-relaxed">
                    This sector is restricted exclusively to verified system admin roles. Security event metadata parameters have logged this access route attempt.
                </p>
            </main>
        );
    }

    // ONE-CLICK ACTION: Approves and publishes candidate dynamically directly onto client directory indexes
    const handleApproveAndPublish = (id: string, name: string) => {
        setApplicants(prev => prev.filter(app => app.id !== id));
        if (selectedApplicant?.id === id) setSelectedApplicant(null);

        console.log(`ITRAIN-015 -> Dispatched structural database update: Publish Profile indices for applicant ID: ${id}`);

        setSystemNotification(`Success: ${name}'s consultant credentials published live to the platform directory.`);
        setTimeout(() => setSystemNotification(null), 4000);
    };

    // ACTION PIPELINE: Initiates rejection workspace overlay modal
    const openRejectionWorkspace = (applicant: ProfessionalApplicant) => {
        setSelectedApplicant(applicant);
        setIsRejectionModalOpen(true);
    };

    // SUBMIT REJECTION: Completes rejection flow with structural field feedback handling
    const handleConfirmRejection = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplicant || !rejectionFeedback.trim()) return;

        setApplicants(prev => prev.filter(app => app.id !== selectedApplicant.id));

        console.log(`ITRAIN-015 -> Dispatched secure transaction: Reject ${selectedApplicant.id}. Feedback logs array: "${rejectionFeedback}"`);

        setSystemNotification(`Notice: Application ${selectedApplicant.id} rejected. Feedback guidelines compiled and emailed.`);
        setIsRejectionModalOpen(false);
        setRejectionFeedback("");
        setSelectedApplicant(null);
        setTimeout(() => setSystemNotification(null), 4000);
    };

    return (
        <section className="w-full min-h-screen bg-white text-purple-950 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto relative">

            {/* Context Header Area */}
            <div className="border-b border-purple-950/5 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
                        ITRAIN Admin Layer
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-purple-950 mt-3">Professional Verification Flags</h1>
                    <p className="text-sm text-purple-950/50 font-medium mt-1">
                        Audit incoming academic consultant credentials, transcripts, and expertise portfolios before catalog indexing.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl text-xs font-bold text-purple-900 shrink-0">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    System Admin Status: Verified Clearance
                </div>
            </div>

            {/* Live Status Updates Alert Panel */}
            {systemNotification && (
                <div className="mb-6 p-4 bg-purple-950 text-white rounded-xl text-xs font-bold tracking-wide shadow-md flex items-center justify-between animate-in fade-in duration-200">
                    <span>{systemNotification}</span>
                    <button onClick={() => setSystemNotification(null)} className="text-orange-500 hover:text-white ml-2">Dismiss</button>
                </div>
            )}

            {/* Primary Grid Layout Splitting Ledger list and Detail Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: List Matrix of Pending Flags */}
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-2 pl-1">
                        Pending Validation Backlog ({applicants.length})
                    </h3>

                    {applicants.length === 0 ? (
                        <div className="border border-dashed border-purple-950/10 rounded-2xl p-8 text-center text-sm text-purple-950/40 font-medium">
                            🎉 Excellent. No pending validation flags require processing.
                        </div>
                    ) : (
                        applicants.map(app => (
                            <div
                                key={app.id}
                                onClick={() => setSelectedApplicant(app)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${selectedApplicant?.id === app.id
                                        ? "bg-purple-50/50 border-purple-950 shadow-sm"
                                        : "bg-white border-purple-950/5 hover:border-purple-950/20 hover:shadow-sm"
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                    <h4 className="font-black text-sm text-purple-950 leading-tight">{app.fullName}</h4>
                                    <span className="text-[9px] font-mono bg-slate-100 border border-slate-200 text-purple-950/60 px-1.5 py-0.5 rounded shrink-0">
                                        {app.id}
                                    </span>
                                </div>
                                <p className="text-xs text-purple-700 font-bold line-clamp-1 mb-2">{app.targetExpertise}</p>
                                <div className="flex justify-between items-center text-[11px] text-purple-950/40 font-semibold">
                                    <span>🏛️ {app.institution}</span>
                                    <span>📅 {app.submissionDate}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Column: In-depth Verification Inspector Workspace */}
                <div className="lg:col-span-7 bg-white border border-purple-950/5 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-purple-950/[0.01]">
                    {selectedApplicant ? (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-purple-950/5 pb-4 gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-purple-950 tracking-tight">{selectedApplicant.fullName}</h2>
                                    <span className="text-xs text-purple-950/50 font-medium font-mono block mt-0.5">{selectedApplicant.email}</span>
                                </div>

                                {/* Structural Execution Action Panel Group */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => openRejectionWorkspace(selectedApplicant)}
                                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs rounded-xl tracking-wide transition-all cursor-pointer"
                                    >
                                        Reject...
                                    </button>

                                    {/* Satisfies instant one-click publication requirements */}
                                    <button
                                        type="button"
                                        onClick={() => handleApproveAndPublish(selectedApplicant.id, selectedApplicant.fullName)}
                                        className="px-4 py-2 bg-purple-950 hover:bg-orange-500 text-white font-black text-xs rounded-xl tracking-wide shadow-md transition-all cursor-pointer"
                                    >
                                        Approve & Publish Profile
                                    </button>
                                </div>
                            </div>

                            {/* Portfolio Context Parameters Area */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-wider text-purple-950/40 block mb-1">Target Consultation Track</label>
                                    <div className="text-sm font-bold text-purple-950 bg-slate-50 border border-purple-950/[0.02] p-3 rounded-xl">
                                        🎯 {selectedApplicant.targetExpertise}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-wider text-purple-950/40 block mb-1">Verified Background & Intent Statement</label>
                                    <p className="text-xs text-purple-950/70 font-medium leading-relaxed bg-slate-50/50 border border-purple-950/[0.01] p-4 rounded-xl">
                                        "{selectedApplicant.bioDescription}"
                                    </p>
                                </div>

                                {/* Verification Asset Drops Tracking Pane */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-wider text-purple-950/40 block mb-1">Uploaded Credential Assets</label>
                                    <div className="flex items-center justify-between border border-purple-950/10 p-3.5 rounded-xl bg-white group hover:border-purple-950/30 transition-all">
                                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                                            <span className="text-xl shrink-0">📄</span>
                                            <div className="overflow-hidden">
                                                <span className="text-xs font-bold text-purple-950 block truncate">{selectedApplicant.transcriptFileName}</span>
                                                <span className="text-[10px] text-purple-950/40 font-medium block">Official Verification Proof Doc / Academic Record</span>
                                            </div>
                                        </div>
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="text-[11px] font-black text-orange-500 hover:text-purple-900 underline shrink-0 tracking-wide"
                                        >
                                            View Asset
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                            <span className="text-3xl mb-2 opacity-40">🔍</span>
                            <h4 className="text-sm font-black text-purple-950/60 uppercase tracking-wide">Inspector Shell Idle</h4>
                            <p className="text-xs text-purple-950/40 font-medium max-w-xs mt-1">
                                Select a pending professional validation record from the backlog column tracking matrix to audit their documents.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Rejection Interface Overlay Modal (Rendered with interactive Feedback Form) */}
            {isRejectionModalOpen && selectedApplicant && (
                <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
                    <div className="bg-white border border-purple-950/10 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-purple-950 tracking-tight">Constructive Feedback Intake</h3>
                            <p className="text-xs text-purple-950/50 font-medium mt-0.5">
                                State your reasons for skipping profile indexing for <strong className="text-purple-950">{selectedApplicant.fullName}</strong>.
                            </p>
                        </div>

                        <form onSubmit={handleConfirmRejection} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-purple-950/60 uppercase block mb-1.5 pl-0.5">Required Deficiencies & Feedback Logs</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={rejectionFeedback}
                                    onChange={(e) => setRejectionFeedback(e.target.value)}
                                    placeholder="e.g., Legibility issue with uploaded transcript file. Please upload a clear digital copy of your board certification registry asset."
                                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl p-3 text-xs text-purple-950 placeholder:text-purple-950/30 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center gap-2.5 justify-end pt-2 border-t border-purple-950/5">
                                <button
                                    type="button"
                                    onClick={() => { setIsRejectionModalOpen(false); setRejectionFeedback(""); }}
                                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-purple-950/60 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl tracking-wide shadow-md shadow-rose-600/10 transition-all cursor-pointer"
                                >
                                    Log Deficiencies & Reject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </section>
    );
};

export default AdminVerificationPanel;