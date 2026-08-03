import React, { useState } from "react";

interface ConsultationFormData {
    firstName: string;
    lastName: string;
    email: string;
    targetField: string;
    areaOfConcern: string;
    secondaryAchievements: string;
    personalContext: string;
}

const AcademicConsultationForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const [formData, setFormData] = useState<ConsultationFormData>({
        firstName: "",
        lastName: "",
        email: "",
        targetField: "",
        areaOfConcern: "",
        secondaryAchievements: "",
        personalContext: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating routing payload into the shared iLearn directory schema
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Routing into shared iLearn directory schema:", formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full bg-slate-50/40 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-950/5">

                {/* Flow Branding Header */}
                <div className="mb-10 text-center sm:text-left">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
                        iLearn Core Track
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight mt-3">
                        Academic Consultation Intake
                    </h2>
                    <p className="text-sm text-purple-950/60 font-medium mt-1">
                        Provide your academic trajectory metrics to match with a verified professional.
                    </p>
                </div>

                {/* Progress Visual Tracker */}
                <div className="flex items-center justify-between mb-10 max-w-xs mx-auto sm:mx-0">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all duration-300 ${currentStep === step
                                    ? "bg-purple-950 text-white shadow-md shadow-purple-950/20 scale-105"
                                    : currentStep > step
                                        ? "bg-orange-500 text-white"
                                        : "bg-purple-50 text-purple-950/40"
                                }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`w-12 h-0.5 mx-2 rounded-full transition-colors duration-300 ${currentStep > step ? "bg-orange-500" : "bg-purple-50"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Main Dynamic Workflow Interface */}
                {!isSubmitted ? (
                    <form onSubmit={currentStep === 3 ? handleSubmit : handleNext} className="space-y-6">

                        {/* STEP 1: Basic Biometrics */}
                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Ekene"
                                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Okonkwo"
                                            className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="student@ilearn.org"
                                        className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Structural Intake Dropdowns (Academic Focus) */}
                        {currentStep === 2 && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <div>
                                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">Target Field of Study</label>
                                    <select
                                        name="targetField"
                                        required
                                        value={formData.targetField}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select your expected discipline</option>
                                        <option value="Engineering & Tech">Engineering & Technology</option>
                                        <option value="Business & Finance">Business Strategy & Operations</option>
                                        <option value="Creative Arts & Media">Creative Arts & Digital Design</option>
                                        <option value="Health & Sciences">Medical Sciences & Health Healthcare</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">Primary Academic Anxiety / Concern</label>
                                    <select
                                        name="areaOfConcern"
                                        required
                                        value={formData.areaOfConcern}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select your primary bottleneck</option>
                                        <option value="Choosing a Major">Choosing a Major / Path Clarity</option>
                                        <option value="Study Habits">Optimizing Study Habits & Focus</option>
                                        <option value="CGPA Strategies">Building a Better CGPA Mapping</option>
                                        <option value="University Know-How">University Application Selection Know-How</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Context and Textarea Validation Blocks */}
                        {currentStep === 3 && (
                            <div className="space-y-5 animate-in fade-in duration-300">
                                <div>
                                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">Current Secondary School Achievements</label>
                                    <input
                                        type="text"
                                        name="secondaryAchievements"
                                        required
                                        value={formData.secondaryAchievements}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Top 5% class ranking, High Honors math scores"
                                        className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5 pl-1">
                                        <label className="text-xs font-bold text-purple-950/70 block">Context / Personal Background</label>
                                        <span className={`text-[10px] font-bold ${formData.personalContext.length > 450 ? "text-rose-500" : "text-purple-950/40"
                                            }`}>
                                            {formData.personalContext.length} / 500 characters
                                        </span>
                                    </div>
                                    <textarea
                                        name="personalContext"
                                        required
                                        maxLength={500}
                                        rows={4}
                                        value={formData.personalContext}
                                        onChange={handleInputChange}
                                        placeholder="Briefly describe your goals, grade anxieties, and what you want to map out with your consultant..."
                                        className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Control Row */}
                        <div className="flex justify-between items-center pt-4 gap-4">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-3.5 border border-purple-950/10 text-purple-950 font-bold rounded-xl text-sm transition-all duration-200 hover:bg-slate-50 cursor-pointer"
                                >
                                    Back
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3.5 bg-orange-500 hover:bg-purple-950 text-white font-black rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                        Routing to Directory...
                                    </span>
                                ) : currentStep === 3 ? (
                                    "Submit Request"
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Post-Submission Success Interstitials */
                    <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-purple-950">Intake Successfully Broadcasted</h3>
                        <p className="text-sm text-purple-950/60 font-medium max-w-sm mx-auto mt-2 leading-relaxed">
                            Your academic trajectory profile has been safely routed into the shared **iLearn matching directory**. A verified consultant will lock onto your ticket shortly.
                        </p>
                        <button
                            onClick={() => {
                                setFormData({ firstName: "", lastName: "", email: "", targetField: "", areaOfConcern: "", secondaryAchievements: "", personalContext: "" });
                                setCurrentStep(1);
                                isSubmitted && setIsSubmitted(false);
                            }}
                            className="mt-8 text-xs font-black text-purple-950 hover:text-orange-500 transition-colors uppercase tracking-widest cursor-pointer"
                        >
                            Open A New Ticket
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AcademicConsultationForm;