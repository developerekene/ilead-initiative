import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "../../../redux/slices/User";
import { FormPanel } from "../formcomponent/FormComponents";
import { authService } from "../../../redux/configuration/services/auth.service";
import {
  EXPERTISE_OPTIONS,
  ExpertiseArea,
  ConsultantTypes,
} from "../../../utils/types";

interface ConsultantRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  existingConsultant?: ConsultantTypes;
}

type Step = 1 | 2 | 3;

const INPUT_CLS =
  "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-950 focus:bg-white transition-all";

const emptyForm = {
  role: "",
  institution: "",
  yearsOfExperience: "",
  expertise: [] as ExpertiseArea[],
  bio: "",
  avatar: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  website: "",
  calendlyLink: "",
};

const formFromConsultant = (c: ConsultantTypes): typeof emptyForm => ({
  role: c.role,
  institution: c.institution,
  yearsOfExperience: String(c.yearsOfExperience ?? ""),
  expertise: c.expertise,
  bio: c.bio,
  avatar: c.avatar,
  linkedin: c.socialLinks?.linkedin ?? "",
  twitter: c.socialLinks?.twitter ?? "",
  instagram: c.socialLinks?.instagram ?? "",
  website: c.socialLinks?.website ?? "",
  calendlyLink: c.calendlyLink ?? "",
});

const ConsultantRegistrationForm: React.FC<ConsultantRegistrationFormProps> = ({
  isOpen,
  onClose,
  existingConsultant,
}) => {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isEditMode = !!existingConsultant;

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(
    existingConsultant ? formFromConsultant(existingConsultant) : emptyForm,
  );

  useEffect(() => {
    if (existingConsultant) {
      setForm(formFromConsultant(existingConsultant));
    }
  }, [existingConsultant]);

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
    setForm(
      existingConsultant ? formFromConsultant(existingConsultant) : emptyForm,
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const yearsNumber = Number(form.yearsOfExperience);
  const canProceedStep1 =
    form.role.trim().length >= 2 &&
    form.institution.trim().length >= 2 &&
    Number.isFinite(yearsNumber) &&
    yearsNumber >= 0;

  const canProceedStep2 =
    form.expertise.length > 0 && form.bio.trim().length >= 20;

  const canSubmit = form.calendlyLink.trim().length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        role: form.role.trim(),
        institution: form.institution.trim(),
        yearsOfExperience: yearsNumber,
        expertise: form.expertise,
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
        socialLinks: {
          linkedin: form.linkedin.trim() || undefined,
          twitter: form.twitter.trim() || undefined,
          instagram: form.instagram.trim() || undefined,
          website: form.website.trim() || undefined,
        },
        calendlyLink: form.calendlyLink.trim(),
      };

      if (isEditMode) {
        await authService.handleUpdateConsultant(payload);
      } else {
        await authService.handleConsultantRegistration(payload);
      }
      setSubmitted(true);
    } catch (e: any) {
      console.error("Consultant profile save failed:", e);
      setError(
        e?.message ??
          `Failed to ${isEditMode ? "update" : "submit"} your profile. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (isOpen && !isLoggedIn) {
    return (
      <FormPanel
        isOpen={isOpen}
        onClose={onClose}
        title="Sign In Required"
        badge="Locked"
        badgeVariant="purple"
      >
        <div className="flex flex-col items-center text-center py-10">
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed mb-6 max-w-xs">
            You need to be signed in to manage a consultant profile.
          </p>
          <button
            onClick={onClose}
            className="bg-purple-950 hover:bg-orange-500 text-white font-black px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
          >
            Close
          </button>
        </div>
      </FormPanel>
    );
  }

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={
        submitted
          ? isEditMode
            ? "Profile Updated"
            : "Profile Submitted"
          : isEditMode
            ? "Edit Your Profile"
            : "Become a Consultant"
      }
      badge={submitted ? "Saved" : `Step ${step} of 3`}
      badgeVariant="purple"
    >
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center mb-5 text-3xl">
            {isEditMode ? "✅" : "🤝"}
          </div>
          <h3 className="text-xl font-black text-purple-950 mb-2">
            {isEditMode ? "Changes Saved!" : "You're In the Directory!"}
          </h3>
          <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-8 max-w-xs">
            {isEditMode
              ? "Your profile has been updated."
              : "Your profile is live. Verification badges are added by the iTrain team after a quick review."}
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
            {([1, 2, 3] as Step[]).map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-purple-950" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          {/* ── Step 1: Primary + basic professional info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Your Details
              </p>

              <div className="bg-slate-50 border border-purple-950/5 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center text-sm font-black shrink-0">
                  {(user?.displayName || user?.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-purple-950 truncate">
                    {existingConsultant?.name || user?.displayName || "—"}
                  </p>
                  <p className="text-xs text-purple-950/40 font-medium truncate">
                    {existingConsultant?.email || user?.email}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-purple-950/30 font-medium pl-0.5">
                Your name and email come from your iLEAD account and can't be
                changed here.
              </p>

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
                  Years of Experience <span className="text-orange-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.yearsOfExperience}
                  onChange={(e) => set("yearsOfExperience", e.target.value)}
                  placeholder="e.g. 5"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Expertise + what they do ── */}
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
                  What You Do <span className="text-orange-500">*</span>
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

          {/* ── Step 3: Image, socials, booking link ── */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Profile & Booking
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Profile Photo URL
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    LinkedIn
                    <span className="text-purple-950/30 font-medium ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) => set("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/..."
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    X / Twitter
                    <span className="text-purple-950/30 font-medium ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.twitter}
                    onChange={(e) => set("twitter", e.target.value)}
                    placeholder="x.com/..."
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Instagram
                    <span className="text-purple-950/30 font-medium ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) => set("instagram", e.target.value)}
                    placeholder="instagram.com/..."
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Website
                    <span className="text-purple-950/30 font-medium ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="yoursite.com"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Calendly Link <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.calendlyLink}
                  onChange={(e) => set("calendlyLink", e.target.value)}
                  placeholder="calendly.com/your-name"
                  className={INPUT_CLS}
                />
                <p className="text-[11px] text-purple-950/30 pl-0.5 mt-1">
                  Students will use this link to book sessions with you.
                </p>
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
                className="bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-7 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Submit Profile 🤝"}
              </button>
            )}
          </div>
        </>
      )}
    </FormPanel>
  );
};

export default ConsultantRegistrationForm;
