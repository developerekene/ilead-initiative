import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/User";
import { FormPanel } from "../formcomponent/FormComponents";
import { WorkshopTypes } from "../../../utils/types";
import { authService } from "../../../redux/configuration/services/auth.service";
import toast from "react-hot-toast";

interface WorkshopRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: WorkshopTypes;
}

type Step = 1 | 2 | 3;

const HEAR_ABOUT_OPTIONS = [
  "iLEAD Community",
  "Social Media",
  "Friend / Colleague",
  "Email Newsletter",
  "University Notice Board",
  "Other",
];

const STUDY_LEVELS = [
  "100 Level / Freshman",
  "200 Level / Sophomore",
  "300 Level / Junior",
  "400 Level / Senior",
  "500 Level / Final Year",
  "Postgraduate",
  "Not a student",
];

const INPUT_CLS =
  "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-950 focus:bg-white transition-all";

const WorkshopRegistrationForm: React.FC<WorkshopRegistrationFormProps> = ({
  isOpen,
  onClose,
  workshop,
}) => {
  const user = useSelector(selectUser);

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: user?.displayName ?? "",
    email: user?.email ?? "",
    phone: "",
    institution: "",
    studyLevel: "",
    department: "",
    heardAbout: "",
    expectation: "",
    agreeToTerms: false,
  });

  const set = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const reset = () => {
    setStep(1);
    setLoading(false);
    setSubmitted(false);
    setError(null);
    setForm({
      fullName: user?.displayName ?? "",
      email: user?.email ?? "",
      phone: "",
      institution: "",
      studyLevel: "",
      department: "",
      heardAbout: "",
      expectation: "",
      agreeToTerms: false,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canProceedStep1 =
    form.fullName.trim().length >= 2 &&
    form.email.trim().includes("@") &&
    form.phone.trim().length >= 7;

  const canProceedStep2 =
    form.institution.trim().length >= 2 && form.studyLevel;

  const canSubmit =
    form.heardAbout.length > 0 &&
    form.expectation.trim().length >= 10 &&
    form.agreeToTerms;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.handleWorkshopRegistration(
        workshop.id,
        workshop.title,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          institution: form.institution.trim(),
          studyLevel: form.studyLevel,
          department: form.department.trim(),
          heardAbout: form.heardAbout,
          expectation: form.expectation.trim(),
        },
      );
      setSubmitted(true);
    } catch (e: any) {
      console.error("Workshop registration failed:", e);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "Registration Complete" : "Register for Workshop"}
      badge={submitted ? "Confirmed" : `Step ${step} of 3`}
      badgeVariant="purple"
    >
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center mb-5 text-3xl">
            🎓
          </div>
          <h3 className="text-xl font-black text-purple-950 mb-2">
            You're Registered!
          </h3>
          <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-2 max-w-xs">
            <span className="font-black text-purple-950">{workshop.title}</span>
          </p>
          <p className="text-xs text-purple-950/40 font-medium mb-1">
            {workshop.date} · {workshop.time}
          </p>
          <p className="text-xs text-purple-950/40 font-medium mb-8">
            {workshop.location}
          </p>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 text-xs font-medium text-purple-950/60 leading-relaxed mb-7 max-w-xs">
            Your registration has been saved. The facilitator will share joining
            details before the session.
          </div>
          <button
            onClick={handleClose}
            className="bg-purple-950 hover:bg-orange-500 text-white font-black px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="flex gap-1">
            {([1, 2, 3] as Step[]).map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-purple-950" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          {/* Workshop mini-summary */}
          <div className="flex items-center gap-3 bg-slate-50 border border-purple-950/5 rounded-2xl px-4 py-3">
            <img
              src={workshop.image}
              alt={workshop.title}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-purple-950 line-clamp-1">
                {workshop.title}
              </p>
              <p className="text-[11px] text-purple-950/40 font-medium">
                {workshop.date} · {workshop.time}
              </p>
            </div>
          </div>

          {/* ── Step 1: Personal details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Your Details
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="e.g. Stella Eneh"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Phone Number <span className="text-orange-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Academic context ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Academic Background
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Institution <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
                  placeholder="e.g. University of Lagos"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  Study Level <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STUDY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => set("studyLevel", level)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                        form.studyLevel === level
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Department / Field
                  <span className="text-purple-950/30 font-medium ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Expectations + consent ── */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Almost There
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  How did you hear about this?{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HEAR_ABOUT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set("heardAbout", opt)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                        form.heardAbout === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  What do you hope to gain?{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <textarea
                  value={form.expectation}
                  onChange={(e) => set("expectation", e.target.value)}
                  placeholder="Share what you're hoping to learn or achieve from this workshop..."
                  rows={4}
                  className={`${INPUT_CLS} resize-none leading-relaxed`}
                />
                <span className="text-[11px] text-purple-950/30 pl-0.5 mt-1 block">
                  {form.expectation.length} chars{" "}
                  {form.expectation.length < 10 && "(min 10)"}
                </span>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeToTerms}
                    onChange={(e) => set("agreeToTerms", e.target.checked)}
                    className="w-4 h-4 accent-purple-700 rounded mt-0.5"
                  />
                  <span className="text-xs font-medium text-purple-950/70 leading-relaxed">
                    I confirm my details are accurate and I commit to attending
                    this workshop. I understand my spot may be released if I
                    don't show up without notice.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-950/5">
            <button
              type="button"
              onClick={() =>
                step > 1 ? setStep((s) => (s - 1) as Step) : handleClose()
              }
              className="text-sm font-bold text-purple-950/40 hover:text-purple-950 transition-colors"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-7 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-7 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Complete Registration 🎓"
                )}
              </button>
            )}
          </div>
        </>
      )}
    </FormPanel>
  );
};

export default WorkshopRegistrationForm;
