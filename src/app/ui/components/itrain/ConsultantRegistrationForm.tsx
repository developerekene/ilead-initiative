import React, { useState } from "react";
import { FormPanel } from "../formcomponent/FormComponents";
import { authService } from "../../../redux/configuration/services/auth.service";
import { EXPERTISE_OPTIONS, ExpertiseArea } from "../../../utils/types";

interface ConsultantRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2;

const INPUT_CLS =
  "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-950 focus:bg-white transition-all";

const emptyForm = {
  name: "",
  role: "",
  institution: "",
  bio: "",
  avatar: "",
  expertise: [] as ExpertiseArea[],
};

const ConsultantRegistrationForm: React.FC<ConsultantRegistrationFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const set = (field: keyof typeof emptyForm, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const toggleExpertise = (area: ExpertiseArea) =>
    setForm((p) => ({
      ...p,
      expertise: p.expertise.includes(area)
        ? p.expertise.filter((e) => e !== area)
        : [...p.expertise, area],
    }));

  const reset = () => {
    setStep(1);
    setLoading(false);
    setSubmitted(false);
    setError(null);
    setForm(emptyForm);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canProceedStep1 =
    form.name.trim().length >= 2 &&
    form.role.trim().length >= 2 &&
    form.institution.trim().length >= 2;

  const canSubmit = form.expertise.length > 0 && form.bio.trim().length >= 20;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.handleConsultantRegistration({
        name: form.name.trim(),
        role: form.role.trim(),
        institution: form.institution.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
        expertise: form.expertise,
      });
      setSubmitted(true);
    } catch (e: any) {
      console.error("Consultant registration failed:", e);
      setError(
        e?.message ?? "Failed to submit your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "Profile Submitted" : "Become a Consultant"}
      badge={submitted ? "Pending Review" : `Step ${step} of 2`}
      badgeVariant="purple"
    >
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center mb-5 text-3xl">
            🤝
          </div>
          <h3 className="text-xl font-black text-purple-950 mb-2">
            You're In the Directory!
          </h3>
          <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-8 max-w-xs">
            Your profile is live. Verification badges are added by the iTrain
            team after a quick review.
          </p>
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
            {([1, 2] as Step[]).map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-purple-950" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          {/* ── Step 1: Identity ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Your Profile
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Dr. Arinze Okoye"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Role / Title <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="e.g. Academic Path Advisor"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Institution <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
                  placeholder="e.g. Imperial College London Alum"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Photo URL
                  <span className="text-purple-950/30 font-medium ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => set("avatar", e.target.value)}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Expertise + bio ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Areas of Expertise
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  Select all that apply{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERTISE_OPTIONS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleExpertise(area)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                        form.expertise.includes(area)
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Bio <span className="text-orange-500">*</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell students how you can help them..."
                  rows={4}
                  className={`${INPUT_CLS} resize-none leading-relaxed`}
                />
                <span className="text-[11px] text-purple-950/30 pl-0.5 mt-1 block">
                  {form.bio.length} chars {form.bio.length < 20 && "(min 20)"}
                </span>
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

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canProceedStep1}
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
                {loading ? "Submitting..." : "Submit Profile 🤝"}
              </button>
            )}
          </div>
        </>
      )}
    </FormPanel>
  );
};

export default ConsultantRegistrationForm;
