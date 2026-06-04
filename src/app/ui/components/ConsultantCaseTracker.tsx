import React, { useState } from "react";

interface StudentCase {
    id: string;
    studentName: string;
    avatarInitials: string;
    targetTrack: string;
    currentCgpa: string;
    targetCgpa: string;
    lastActiveLog: string;
    status: "Pending Review" | "Active Mentorship" | "Completed Tracks";
}

const ConsultantCaseTracker: React.FC = () => {
    // Controlled state matrix simulating interactive dataset changes in-view
    const [cases, setCases] = useState<StudentCase[]>([
        {
            id: "STU-402",
            studentName: "Amara Nwosu",
            avatarInitials: "AN",
            targetTrack: "Pre-Med Entry Prep",
            currentCgpa: "3.42",
            targetCgpa: "4.50",
            lastActiveLog: "Diagnostic admission essay uploaded",
            status: "Pending Review"
        },
        {
            id: "STU-109",
            studentName: "Tunde Bakare",
            avatarInitials: "TB",
            targetTrack: "Engineering Calculus & Focus",
            currentCgpa: "2.85",
            targetCgpa: "4.00",
            lastActiveLog: "Completed Study Habit calibration template v2",
            status: "Active Mentorship"
        },
        {
            id: "STU-881",
            studentName: "Chidi Okafor",
            avatarInitials: "CO",
            targetTrack: "Computer Science University Admissions",
            currentCgpa: "4.20",
            targetCgpa: "4.50",
            lastActiveLog: "Mock Interview Grading simulator run approved",
            status: "Completed Tracks"
        },
        {
            id: "STU-214",
            studentName: "Sarah Jenkins",
            avatarInitials: "SJ",
            targetTrack: "Economics Data Foundation Strategy",
            currentCgpa: "3.10",
            targetCgpa: "4.10",
            lastActiveLog: "Intake form submitted",
            status: "Pending Review"
        }
    ]);

    // Single-action inline state updates satisfying Acceptance Criteria #1
    const moveStatus = (caseId: string, nextStatus: "Pending Review" | "Active Mentorship" | "Completed Tracks") => {
        setCases(prev =>
            prev.map(item => (item.id === caseId ? { ...item, status: nextStatus } : item))
        );
    };

    // Helper functions representing deep hotlink triggers satisfying Acceptance Criteria #2
    const triggerCgpaToast = (student: string, current: string, target: string) => {
        alert(`Opening CGPA Projection Engine for ${student}\nCurrent Matrix: ${current} → Target Runway: ${target}`);
    };

    const triggerDiagnosticToast = (student: string, log: string) => {
        alert(`Opening Diagnostic Activity Logs for ${student}\nLatest Trace: "${log}"`);
    };

    // Columns config object for rendering clean workflow blocks
    const columnDefinitions: { id: "Pending Review" | "Active Mentorship" | "Completed Tracks"; label: string; badgeColor: string }[] = [
        { id: "Pending Review", label: "Pending Review", badgeColor: "bg-amber-50 text-amber-800 border-amber-200" },
        { id: "Active Mentorship", label: "Active Mentorship", badgeColor: "bg-purple-50 text-purple-800 border-purple-200" },
        { id: "Completed Tracks", label: "Completed Tracks", badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200" }
    ];

    return (
        <div className="w-full bg-white rounded-[2rem] border border-purple-950/10 p-6 md:p-8 shadow-xl shadow-purple-950/[0.01]">

            {/* Header Module */}
            <div className="border-b border-purple-950/5 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-100">
                        ITRAIN Panel
                    </span>
                    <h3 className="text-xl font-black text-purple-950 tracking-tight mt-2">Exclusive Consultant Case Tracking Hub</h3>
                    <p className="text-xs text-purple-950/50 font-medium mt-0.5">
                        Here we track student diagnostics, update mentoring statuses, and inspect intake forms in real time.
                    </p>
                </div>
                <div className="text-xs font-bold text-purple-950/60 bg-slate-50 border border-purple-950/5 px-4 py-2 rounded-xl self-start sm:self-center">
                    Total Active Load: <span className="text-purple-950 font-black">{cases.length} Students +</span>
                </div>
            </div>

            {/* Workflow Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {columnDefinitions.map(column => {
                    const columnCases = cases.filter(c => c.status === column.id);

                    return (
                        <div key={column.id} className="bg-slate-50/50 border border-purple-950/[0.02] rounded-2xl p-4 flex flex-col min-h-[450px]">

                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-950/5">
                                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${column.badgeColor}`}>
                                    {column.label}
                                </span>
                                <span className="text-xs font-black text-purple-950/40 bg-white border border-purple-950/5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                    {columnCases.length}
                                </span>
                            </div>

                            {/* Column Cards Stream */}
                            <div className="space-y-3.5 flex-1 overflow-y-auto">
                                {columnCases.length === 0 ? (
                                    <div className="h-32 border border-dashed border-purple-950/10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                                        <span className="text-xs font-bold text-purple-950/30">No assignments active</span>
                                    </div>
                                ) : (
                                    columnCases.map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-white border border-purple-950/5 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-purple-950/10 transition-all group"
                                        >
                                            {/* Profile Row */}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-950 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                                                    {item.avatarInitials}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-black text-purple-950 truncate">{item.studentName}</h4>
                                                    <span className="text-[10px] font-bold text-purple-950/40 block tracking-tight truncate">
                                                        {item.targetTrack}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Live Activity Diagnostic Snippet */}
                                            <div className="bg-slate-50 border border-purple-950/[0.02] rounded-lg p-2.5 mb-3 text-[11px] font-medium text-purple-950/70 leading-relaxed">
                                                <span className="font-bold text-purple-950/40 uppercase text-[9px] tracking-wider block mb-0.5">Last Log Context</span>
                                                <span className="line-clamp-2">{item.lastActiveLog}</span>
                                            </div>

                                            {/* Hotlink Core Triggers (Acceptance Criteria #2) */}
                                            <div className="grid grid-cols-2 gap-2 mb-4 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => triggerCgpaToast(item.studentName, item.currentCgpa, item.targetCgpa)}
                                                    className="px-2 py-1.5 bg-white border border-purple-950/10 hover:border-purple-950 rounded-lg text-[10px] font-bold text-purple-950 text-left transition-all truncate flex items-center justify-between"
                                                >
                                                    📊 CGPA Runway <span className="font-black text-purple-950 bg-slate-100 px-1 rounded">{item.currentCgpa}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => triggerDiagnosticToast(item.studentName, item.lastActiveLog)}
                                                    className="px-2 py-1.5 bg-white border border-purple-950/10 hover:border-purple-950 rounded-lg text-[10px] font-bold text-purple-950 text-left transition-all truncate"
                                                >
                                                    📁 Activity Logs
                                                </button>
                                            </div>

                                            {/* Pipeline Action Matrix (Acceptance Criteria #1) */}
                                            <div className="border-t border-purple-950/5 pt-3 flex items-center justify-end gap-1.5">
                                                <span className="text-[9px] font-bold text-purple-950/30 uppercase mr-auto select-none">Route:</span>

                                                {item.status !== "Pending Review" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => moveStatus(item.id, "Pending Review")}
                                                        className="px-2 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-purple-950/60 font-bold text-[10px] rounded transition-colors"
                                                        title="Revert to Pending"
                                                    >
                                                        ← Hold
                                                    </button>
                                                )}

                                                {item.status === "Pending Review" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => moveStatus(item.id, "Active Mentorship")}
                                                        className="px-2.5 py-1 bg-purple-950 hover:bg-orange-500 text-white font-black text-[10px] rounded tracking-wide transition-colors shadow-sm w-full text-center"
                                                    >
                                                        Approve Intake →
                                                    </button>
                                                )}

                                                {item.status === "Active Mentorship" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => moveStatus(item.id, "Completed Tracks")}
                                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded tracking-wide transition-colors shadow-sm"
                                                    >
                                                        Complete Track ✓
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ConsultantCaseTracker;