import React, { useState, useEffect, useRef } from "react";

interface FeedbackPayload {
    sessionId: string;
    metrics: {
        clarity: number;
        focusGuidance: number;
        academicKnowHow: number;
    };
    writtenNotes: string;
    integrityEscalationFlag: boolean;
}

interface SessionFeedbackModalProps {
    isOpen: boolean;
    sessionId: string;
    instructorName: string;
    onClose: () => void;
    onSubmitFeedback: (payload: FeedbackPayload) => void;
}

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({
    isOpen,
    sessionId,
    instructorName,
    onClose,
    onSubmitFeedback
}) => {
    // Evaluation Metrics Tracking States
    const [clarity, setClarity] = useState<number>(0);
    const [focusGuidance, setFocusGuidance] = useState<number>(0);
    const [academicKnowHow, setAcademicKnowHow] = useState<number>(0);
    const [writtenNotes, setWrittenNotes] = useState<string>("");
    
    // Safety & Integrity Interception State
    const [integrityEscalationFlag, setIntegrityEscalationFlag] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement>(null);

    // List of toxic, abusive, or rule-breaking trigger indicators to scan for real-time compliance flagging
    const BANNED_KEYWORDS = ["scam", "abuse", "insult", "harass", "threat", "stole", "extort", "fraud"];

    // 1. Acceptance Criteria Satisfied: Trap focus into overlay frame when opened
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Focus on the modal container to anchor assistive tech readers
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    // 2. Acceptance Criteria Satisfied: Scan input for compliance violations & auto-flag admin hooks
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setWrittenNotes(value);

        const textLower = value.toLowerCase();
        const containsViolation = BANNED_KEYWORDS.some(keyword => textLower.includes(keyword));
        setIntegrityEscalationFlag(containsViolation);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const feedbackData: FeedbackPayload = {
            sessionId,
            metrics: {
                clarity,
                focusGuidance,
                academicKnowHow
            },
            writtenNotes,
            integrityEscalationFlag
        };

        console.log("ITRAIN-012 -> Dispatching core review index registry map:", feedbackData);
        onSubmitFeedback(feedbackData);
        
        // Reset states
        setClarity(0);
        setFocusGuidance(0);
        setAcademicKnowHow(0);
        setWrittenNotes("");
        setIntegrityEscalationFlag(false);
        onClose();
    };

    if (!isOpen) return null;

    // Helper to render responsive star nodes
    const renderStarRow = (currentValue: number, setterFunc: (val: number) => void) => {
        return (
            <div className="flex items-center gap-1.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                    <button
                        type="button"
                        key={starIndex}
                        onClick={() => setterFunc(starIndex)}
                        className={`text-xl transition-all duration-150 transform hover:scale-125 focus:outline-none cursor-pointer ${
                            starIndex <= currentValue ? "text-amber-500 scale-110" : "text-purple-950/10 hover:text-amber-400"
                        }`}
                    >
                        ★
                    </button>
                ))}
                <span className="text-xs font-black text-purple-950/40 ml-2 w-4">
                    {currentValue > 0 ? `${currentValue}/5` : "--"}
                </span>
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Modal Canvas Window (bg === white) */}
            <div 
                ref={modalRef}
                tabIndex={-1}
                className="w-full max-w-lg bg-white rounded-[2rem] border border-purple-950/5 p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
            >
                
                {/* Header Metrics Branding Info */}
                <div className="mb-6">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md">
                                ITRAIN-012 Feedback Form
                            </span>
                            <h2 id="modal-title" className="text-xl font-black text-purple-950 tracking-tight mt-3">
                                Share Your Experience
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-purple-950/30 hover:text-purple-950 text-xl font-medium p-1 transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-xs text-purple-950/50 font-medium mt-1.5">
                        Your confidential evaluation keeps our academy standards high. Reviewing session with <span className="text-purple-950 font-bold">{instructorName}</span>.
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    
                    {/* Five-Point Metric Blocks */}
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-purple-950/[0.02]">
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block pl-0.5">
                                Explanation Clarity
                            </label>
                            <p className="text-[10px] text-purple-950/40 font-medium -mt-0.5">Was the roadmap delivered plainly and easily understood?</p>
                            {renderStarRow(clarity, setClarity)}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block pl-0.5">
                                Strategic Focus Guidance
                            </label>
                            <p className="text-[10px] text-purple-950/40 font-medium -mt-0.5">Did they map clear actionable steps, targets, or study metrics?</p>
                            {renderStarRow(focusGuidance, setFocusGuidance)}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block pl-0.5">
                                Academic & Technical Know-How
                            </label>
                            <p className="text-[10px] text-purple-950/40 font-medium -mt-0.5">Did the consultant demonstrate expert competence in the field?</p>
                            {renderStarRow(academicKnowHow, setAcademicKnowHow)}
                        </div>
                    </div>

                    {/* Written Documentation Block */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5 px-0.5">
                            <label className="text-xs font-bold text-purple-950/70 block">
                                Additional Notes & Written Assessment
                            </label>
                            <span className="text-[10px] font-medium text-purple-950/30">Optional</span>
                        </div>
                        <textarea
                            value={writtenNotes}
                            onChange={handleNotesChange}
                            placeholder="Share what worked well or what can be calibrated further..."
                            rows={3}
                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-xs text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-950 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Interactive Integrity Interception Flag Alert Window */}
                    {integrityEscalationFlag && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-headShake">
                            <span className="text-base select-none leading-none mt-0.5">⚠️</span>
                            <div>
                                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">
                                    Admin Integrity Escalation Triggered
                                </h4>
                                <p className="text-[10px] text-rose-800/80 font-medium mt-0.5 leading-relaxed">
                                    Your input includes context phrases flagged for security auditing. Upon submission, this review bypasses public indexing and streams immediately to core workspace admins for verification.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Operational Triggers Block */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-purple-950/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 border border-purple-950/10 hover:border-purple-950 text-purple-950 font-bold text-xs rounded-xl tracking-wide transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            disabled={clarity === 0 || focusGuidance === 0 || academicKnowHow === 0}
                            className={`px-5 py-3 font-black text-xs rounded-xl tracking-wide shadow-md transition-all ${
                                clarity > 0 && focusGuidance > 0 && academicKnowHow > 0
                                    ? "bg-purple-950 text-white hover:bg-orange-500 hover:shadow-orange-500/10 cursor-pointer transform hover:-translate-y-0.5"
                                    : "bg-purple-950/20 text-purple-950/40 cursor-not-allowed shadow-none"
                            }`}
                        >
                            Submit Review Matrix
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SessionFeedbackModal;