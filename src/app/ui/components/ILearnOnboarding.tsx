import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingFormData {
    isLearner: boolean;
    isTeacher: boolean;
}

const ILearnOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Core state tracking user tracking selections
    const [tracks, setTracks] = useState<OnboardingFormData>({
        isLearner: false,
        isTeacher: false,
    });

    const toggleTrack = (key: keyof OnboardingFormData) => {
        setTracks((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        // Dynamic error clearing as they interact
        setErrors([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        // Strict Ticket Validation: Must select at least one path
        if (!tracks.isLearner && !tracks.isTeacher) {
            setErrors(["You must explicitly select at least one option to customize your workspace layout."]);
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulated asynchronous database persistence payload mapping
            console.log("Persisting profile flags to database:", tracks);

            // Artificial network wait to show loading state animations
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // [AC Validation Ticket Point 3]: Redirects smoothly to the iTrain root setup
            navigate("/itrain");
        } catch (err) {
            setErrors(["An error occurred mapping your database preferences. Please retry."]);
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
            <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 p-8 md:p-12 lg:p-16">

                {/* Onboarding Dynamic Meta Header */}
                <div className="text-center mb-12 max-w-xl mx-auto">
                    
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950 mt-4 mb-3">
                        Welcome to <span className="text-purple-700">iLearn</span>
                    </h2>
                    <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed">
                        Customize your workspace layout. Choose how you intend to engage with our self-sustaining peer ecosystem today.
                    </p>
                </div>

                {/* Validation Error Banner UI Output Wrapper */}
                {errors.length > 0 && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-900 animate-in fade-in duration-200">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {errors.map((err, i) => <p key={i}>{err}</p>)}
                        </div>
                    </div>
                )}

                {/* Main Onboarding Interactive Selection View Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                        {/* Option A Card Component: I Learn (Student) */}
                        <div
                            onClick={() => toggleTrack("isLearner")}
                            className={`group relative border rounded-3xl p-6 md:p-8 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-1 ${tracks.isLearner
                                    ? "bg-purple-950 border-purple-950 text-white shadow-xl shadow-purple-950/10"
                                    : "bg-white border-purple-950/10 hover:border-orange-500/30 text-purple-950 hover:shadow-xl hover:shadow-purple-950/[0.02]"
                                }`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${tracks.isLearner
                                            ? "bg-purple-900 border-purple-800 text-purple-200"
                                            : "bg-purple-50 border-purple-100 text-purple-700"
                                        }`}>
                                        Seek Consultation
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${tracks.isLearner
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "border-purple-950/20 bg-white"
                                        }`}>
                                        {tracks.isLearner && <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-orange-500 transition-colors duration-200">I Learn</h3>
                                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${tracks.isLearner ? "text-purple-200" : "text-purple-950/60"}`}>
                                    Master actionable study habits, organize your CGPA targets, and work live with industry professionals before university.
                                </p>
                            </div>
                        </div>

                        {/* Option B Card Component: I Teach (Consultant) */}
                        <div
                            onClick={() => toggleTrack("isTeacher")}
                            className={`group relative border rounded-3xl p-6 md:p-8 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-1 ${tracks.isTeacher
                                    ? "bg-purple-950 border-purple-950 text-white shadow-xl shadow-purple-950/10"
                                    : "bg-white border-purple-950/10 hover:border-orange-500/30 text-purple-950 hover:shadow-xl hover:shadow-purple-950/[0.02]"
                                }`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${tracks.isTeacher
                                            ? "bg-purple-900 border-purple-800 text-purple-200"
                                            : "bg-purple-50 border-purple-100 text-purple-700"
                                        }`}>
                                        Provide Mentorship
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${tracks.isTeacher
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "border-purple-950/20 bg-white"
                                        }`}>
                                        {tracks.isTeacher && <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-2 tracking-tight group-hover:text-orange-500 transition-colors duration-200">I Teach</h3>
                                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${tracks.isTeacher ? "text-purple-200" : "text-purple-950/60"}`}>
                                    Share your institutional knowledge, help students clear academic blocks, and build the next tier of academic leaders.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Meta Status Indicator Note Info Block */}
                    <div className="bg-slate-50 border border-purple-950/[0.03] rounded-2xl p-4 text-center text-xs text-purple-950/50 font-medium">
                        💡 <strong className="text-purple-950">Pro-tip:</strong> You can select <span className="text-purple-900 font-bold">both tracks</span> if you plan to share your strengths while developing yourself in other disciplines.
                    </div>

                    {/* Submission Layout Control Blocks */}
                    <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row justify-end items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-orange-500 hover:bg-purple-950 text-white font-black py-4 px-10 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 hover:shadow-purple-950/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Configuring Workspace...
                                </>
                            ) : (
                                "Finalize Dashboard Layout"
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </section>
    );
};

export default ILearnOnboarding;