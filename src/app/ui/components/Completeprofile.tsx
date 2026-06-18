import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  doc,
  updateDoc,
  serverTimestamp,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  selectUser,
  selectIsLoggedIn,
  selectProfileComplete,
  setProfileComplete,
} from "../../redux/slices/User";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { authService } from "../../redux/configuration/services/auth.service";

type AccountType = "individual" | "contributor";
type Step = 1 | 2 | 3;

const INDIVIDUAL_GOALS = [
  "Find a mentor",
  "Build a project",
  "Land a job",
  "Launch a startup",
  "Learn collaboratively",
  "Network & connect",
];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional"];
const CONTRIBUTOR_SKILLS = [
  "React / React Native",
  "Node.js / Backend",
  "Product Strategy",
  "UX Design",
  "Business Dev",
  "Data Science",
  "DevOps / Cloud",
  "Fundraising",
];
const CONTRIBUTION_TYPES = [
  "1:1 mentorship",
  "Group workshops",
  "Share resources",
  "Code reviews",
  "Career coaching",
];
const AVAILABILITY_SLOTS = [
  "Weekday mornings",
  "Weekday evenings",
  "Saturday",
  "Sunday",
];

const STEP_LABELS: Record<AccountType, Record<Step, string>> = {
  individual: {
    1: "About you",
    2: "Your learning goals",
    3: "Availability & links",
  },
  contributor: {
    1: "About you",
    2: "Your expertise",
    3: "Availability & links",
  },
};

// ─── Reusable field wrapper
const inputCls = (err?: string) =>
  `w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-purple-950
     placeholder:text-purple-950/20 font-medium focus:outline-none focus:bg-white
     transition-all ${
       err
         ? "border-red-400 focus:border-red-400"
         : "border-purple-950/10 focus:border-orange-500"
     }`;

const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div>
    <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-2">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
  </div>
);

// ─── Chip selector ────────────────────────────────────────────────────────────
const ChipGroup: React.FC<{
  options: string[];
  selected: string[];
  multi?: boolean;
  max?: number;
  onChange: (v: string[]) => void;
}> = ({ options, selected, multi = false, max, onChange }) => {
  const toggle = (opt: string) => {
    if (!multi) {
      onChange([opt]);
      return;
    }
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
      return;
    }
    if (max && selected.length >= max) return;
    onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-150 cursor-pointer ${
            selected.includes(opt)
              ? "bg-purple-950 text-white border-purple-950"
              : "bg-slate-50 text-purple-950/50 border-purple-950/10 hover:border-orange-500 hover:text-orange-500"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

// ─── Availability checkbox grid
const AvailGrid: React.FC<{
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}> = ({ options, selected, onChange }) => {
  const toggle = (opt: string) =>
    selected.includes(opt)
      ? onChange(selected.filter((s) => s !== opt))
      : onChange([...selected, opt]);
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              active
                ? "bg-orange-50 border-orange-300 text-orange-700"
                : "bg-slate-50 border-purple-950/10 text-purple-950/50 hover:border-purple-950/20"
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all ${active ? "bg-orange-500 border-orange-500" : "border-purple-950/20 bg-white"}`}
            >
              {active && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
};

// ─── Progress bar header ──────────────────────────────────────────────────────
const ProgressBar: React.FC<{ step: Step; accountType: AccountType }> = ({
  step,
  accountType,
}) => (
  <div className="bg-purple-950 px-8 py-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-widest text-purple-300/60">
          Profile setup
        </span>
        <span className="bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold px-3 py-0.5 rounded-full capitalize">
          {accountType}
        </span>
      </div>
      <span className="text-xs font-bold text-purple-300/60">
        Step {step} of 3 — {STEP_LABELS[accountType][step]}
      </span>
    </div>
    <div className="w-full h-1.5 bg-purple-800/50 rounded-full overflow-hidden">
      <div
        className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.round((step / 3) * 100)}%` }}
      />
    </div>
  </div>
);

// ─── Step navigation actions ──────────────────────────────────────────────────
const StepActions: React.FC<{
  step: Step;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  finalStep?: boolean;
  saving?: boolean;
}> = ({
  step,
  onBack,
  onNext,
  nextLabel = "Continue",
  finalStep = false,
  saving = false,
}) => (
  <div className="flex gap-3 pt-6 mt-2 border-t border-purple-950/5">
    {step > 1 && (
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-950/10 text-sm font-bold text-purple-950/60 hover:text-purple-950 hover:bg-slate-50 transition-all cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
    )}
    <button
      type="button"
      onClick={onNext}
      disabled={saving}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-black text-white tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${
        finalStep
          ? "bg-purple-950 hover:bg-purple-900 shadow-purple-950/20"
          : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
      }`}
    >
      {saving ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Saving...
        </>
      ) : (
        <>
          {nextLabel}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </>
      )}
    </button>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Redux selectors ───────────────────────────────────────────────────────
  // selectUser returns SerializedUser | null — safe, no Firebase object in Redux
  const reduxUser = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch<AppDispatch>();
  const profileComplete = useSelector(selectProfileComplete);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/join-our-community", { replace: true });
  //   }
  // }, [isLoggedIn, navigate]);

  //Auth guard: redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Returning user who already completed profile, skip straight to dashboard
    if (profileComplete === true) {
      navigate("/dashboard", { replace: true });
    }
  }, [profileComplete, navigate]);

  //Local UI state
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [step, setStep] = useState<Step>(1);
  const [isDone, setIsDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 — shared
  const [avatarPreview, setAvatarPreview] = useState("");
  const [initials, setInitials] = useState("?");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");

  // Step 2 — Individual
  const [interestArea, setInterestArea] = useState("");
  const [skillLevel, setSkillLevel] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>(["Find a mentor"]);
  const [hoursPerWeek, setHoursPerWeek] = useState("4–8 hours");

  // Step 2 — Contributor
  const [role, setRole] = useState("");
  const [yearsExp, setYearsExp] = useState("3–7 years");
  const [contribSkills, setContribSkills] = useState<string[]>([
    "React / React Native",
  ]);
  const [contribTypes, setContribTypes] = useState<string[]>([
    "1:1 mentorship",
  ]);

  // Step 3 — shared
  const [availability, setAvailability] = useState<string[]>([""]);
  const [contactMethod, setContactMethod] = useState(
    "Via iLEAD platform messages",
  );
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");

  // ── Seed initials & accountType from sessionStorage / Redux ──────────────
  useEffect(() => {
    // Account type written by JoinCommunity before navigating here
    const storedType = sessionStorage.getItem(
      "ilead_account_type",
    ) as AccountType | null;
    if (storedType) setAccountType(storedType);

    // Try sessionStorage first (email/password flow)
    try {
      const reg = JSON.parse(sessionStorage.getItem("ilead_reg_data") ?? "{}");
      const i = (
        (reg.firstName?.[0] ?? "") + (reg.lastName?.[0] ?? "")
      ).toUpperCase();
      if (i) {
        setInitials(i);
        return;
      }
    } catch (_) {
      /* noop */
    }

    // Fallback: derive initials from Redux user (Google flow)
    if (reduxUser?.displayName) {
      const parts = reduxUser.displayName.split(" ");
      const i = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
      if (i) setInitials(i);
    }
  }, [reduxUser]);

  // ── Avatar upload ─────────────────────────────────────────────────────────
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const clearErr = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: "" }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!location.trim()) e.location = "Please enter your location";
    if (!bio.trim()) e.bio = "Please add a short bio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (accountType === "individual") {
      if (!interestArea) e.interestArea = "Please select an interest area";
      if (skillLevel.length === 0)
        e.skillLevel = "Please select your skill level";
    } else {
      if (!role.trim()) e.role = "Please enter your role";
      if (contribSkills.length === 0)
        e.contribSkills = "Please select at least one skill";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (availability.length === 0)
      e.availability = "Please select at least one slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  //Save to Firestore
  const saveToFirestore = async () => {
    if (!reduxUser?.uid) {
      setSaveError("Session expired. Please sign in again.");
      return;
    }

    setSaving(true);
    setSaveError("");

    const profileData: WithFieldValue<DocumentData> = {
      location,
      bio,
      pronouns,
      ...(avatarPreview ? { avatarUrl: avatarPreview } : {}),
      ...(accountType === "individual"
        ? { interestArea, skillLevel: skillLevel[0] ?? "", goals, hoursPerWeek }
        : {}),
      ...(accountType === "contributor"
        ? { role, yearsExp, contribSkills, contribTypes }
        : {}),
      availability,
      contactMethod,
      ...(linkedin ? { linkedin } : {}),
      ...(github ? { github } : {}),
      ...(twitter ? { twitter } : {}),
      profileComplete: true,
      updatedAt: serverTimestamp(),
    };

    try {
      await authService.updateUserInformation(profileData);
      dispatch(setProfileComplete(true));
      sessionStorage.removeItem("ilead_account_type");
      sessionStorage.removeItem("ilead_reg_data");
      setIsDone(true);
    } catch (err) {
      console.error("Firestore profile save error:", err);
      setSaveError("Failed to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  //Step navigation
  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) {
      if (!validateStep3()) return;
      saveToFirestore();
      return;
    }
    setErrors({});
    setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => (s - 1) as Step);
  };

  if (!isLoggedIn) {
    return null;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden">
        {!isDone && <ProgressBar step={step} accountType={accountType} />}

        {/* ── Done state ──────────────────────────────────────────── */}
        {isDone && (
          <div className="flex flex-col items-center text-center px-8 py-16 gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-purple-950 tracking-tight mb-2">
                You're in the ecosystem.
              </h2>
              <p className="text-sm text-purple-950/50 font-medium leading-relaxed max-w-sm mx-auto">
                Your profile is live. Jump into your first iShare post or
                explore the community feed.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-orange-500 hover:bg-purple-950 text-white font-black px-8 py-4 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Go to Dashboard →
            </button>
          </div>
        )}

        {!isDone && (
          <div className="px-8 py-8">
            {/* Firestore error banner */}
            {saveError && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-red-700 font-medium">{saveError}</p>
              </div>
            )}

            {/* ── STEP 1: Basic info (both tracks) ────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Avatar */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
                    Profile photo
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-dashed border-purple-950/10 hover:border-orange-500 transition-colors cursor-pointer"
                      style={
                        avatarPreview
                          ? {
                              backgroundImage: `url(${avatarPreview})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "none",
                            }
                          : {
                              background:
                                "linear-gradient(135deg,#3b0764,#f97316)",
                            }
                      }
                    >
                      {!avatarPreview && (
                        <span className="text-white text-lg font-black">
                          {initials}
                        </span>
                      )}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer block mb-0.5"
                      >
                        Upload photo
                      </button>
                      <span className="text-xs text-purple-950/40 font-medium">
                        PNG or JPG · Visible to community members
                      </span>
                    </div>
                  </div>
                </div>

                <Field label="Location" error={errors.location}>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      clearErr("location");
                    }}
                    placeholder="Lagos, Nigeria"
                    className={inputCls(errors.location)}
                  />
                </Field>

                <Field label="Short bio" error={errors.bio}>
                  <textarea
                    value={bio}
                    rows={3}
                    onChange={(e) => {
                      setBio(e.target.value);
                      clearErr("bio");
                    }}
                    placeholder="A brief intro about your background and goals..."
                    className={
                      inputCls(errors.bio) + " resize-none leading-relaxed"
                    }
                  />
                </Field>

                <Field label="Pronouns (optional)">
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="e.g. she/her, he/him, they/them"
                    className={inputCls()}
                  />
                </Field>

                <StepActions step={step} onBack={goBack} onNext={goNext} />
              </div>
            )}

            {/* ── STEP 2 — Individual ──────────────────────────── */}
            {step === 2 && accountType === "individual" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-purple-950 tracking-tight mb-1">
                    Your learning goals
                  </h3>
                  <p className="text-sm text-purple-950/40 font-medium">
                    Help us personalise your ecosystem experience.
                  </p>
                </div>

                <Field
                  label="Primary interest area"
                  error={errors.interestArea}
                >
                  <select
                    value={interestArea}
                    onChange={(e) => {
                      setInterestArea(e.target.value);
                      clearErr("interestArea");
                    }}
                    className={inputCls(errors.interestArea)}
                  >
                    <option value="">Select one...</option>
                    <option>Frontend Development</option>
                    <option>Backend / API Engineering</option>
                    <option>Mobile (React Native / Flutter)</option>
                    <option>Product Design & UX</option>
                    <option>Business Strategy & Operations</option>
                    <option>Data & Analytics</option>
                    <option>General Digital Literacy</option>
                  </select>
                </Field>

                <Field label="Current skill level" error={errors.skillLevel}>
                  <ChipGroup
                    options={SKILL_LEVELS}
                    selected={skillLevel}
                    onChange={(v) => {
                      setSkillLevel(v);
                      clearErr("skillLevel");
                    }}
                  />
                </Field>

                <Field label="What are you hoping to gain?">
                  <ChipGroup
                    options={INDIVIDUAL_GOALS}
                    selected={goals}
                    multi
                    onChange={setGoals}
                  />
                </Field>

                <Field label="Weekly time commitment">
                  <select
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className={inputCls()}
                  >
                    <option>1–3 hours</option>
                    <option>4–8 hours</option>
                    <option>8–15 hours</option>
                    <option>15+ hours</option>
                  </select>
                </Field>

                <StepActions step={step} onBack={goBack} onNext={goNext} />
              </div>
            )}

            {/* ── STEP 2 — Contributor ─────────────────────────── */}
            {step === 2 && accountType === "contributor" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-purple-950 tracking-tight mb-1">
                    Your expertise & offer
                  </h3>
                  <p className="text-sm text-purple-950/40 font-medium">
                    Tell the community what you bring to the table.
                  </p>
                </div>

                <Field label="Role / professional title" error={errors.role}>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      clearErr("role");
                    }}
                    placeholder="e.g. Senior React Engineer, Product Designer"
                    className={inputCls(errors.role)}
                  />
                </Field>

                <Field label="Years of professional experience">
                  <select
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    className={inputCls()}
                  >
                    <option>Less than 1 year</option>
                    <option>1–3 years</option>
                    <option>3–7 years</option>
                    <option>7–12 years</option>
                    <option>12+ years</option>
                  </select>
                </Field>

                <Field
                  label="Top skill areas (up to 4)"
                  error={errors.contribSkills}
                >
                  <ChipGroup
                    options={CONTRIBUTOR_SKILLS}
                    selected={contribSkills}
                    multi
                    max={4}
                    onChange={(v) => {
                      setContribSkills(v);
                      clearErr("contribSkills");
                    }}
                  />
                </Field>

                <Field label="How do you want to contribute?">
                  <ChipGroup
                    options={CONTRIBUTION_TYPES}
                    selected={contribTypes}
                    multi
                    onChange={setContribTypes}
                  />
                </Field>

                <StepActions step={step} onBack={goBack} onNext={goNext} />
              </div>
            )}

            {/* ── STEP 3: Availability + socials (both tracks) ─── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-purple-950 tracking-tight mb-1">
                    {accountType === "contributor"
                      ? "Your availability & reach"
                      : "Availability & connections"}
                  </h3>
                  <p className="text-sm text-purple-950/40 font-medium">
                    {accountType === "contributor"
                      ? "Let mentees know when to reach you and how to find your work."
                      : "Let others know when you're reachable across the ecosystem."}
                  </p>
                </div>

                <Field label="Available slots" error={errors.availability}>
                  <AvailGrid
                    options={AVAILABILITY_SLOTS}
                    selected={availability}
                    onChange={(v) => {
                      setAvailability(v);
                      clearErr("availability");
                    }}
                  />
                </Field>

                <Field label="Preferred contact method">
                  <select
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className={inputCls()}
                  >
                    <option>Via iLEAD platform messages</option>
                    <option>WhatsApp (number shared privately)</option>
                    <option>Email</option>
                    <option>Google Meet / Zoom</option>
                  </select>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="LinkedIn (optional)">
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/..."
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="GitHub / Portfolio">
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="github.com/..."
                      className={inputCls()}
                    />
                  </Field>
                </div>

                <Field label="Twitter / X (optional)">
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle"
                    className={inputCls()}
                  />
                </Field>

                {/* Privacy notice */}
                <div className="flex items-start gap-3 bg-orange-50/60 border border-orange-100 rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-xs text-orange-800/70 font-medium leading-relaxed">
                    Your contact details are only revealed to matched peers
                    after you accept a connection request.
                  </p>
                </div>

                <StepActions
                  step={step}
                  onBack={goBack}
                  onNext={goNext}
                  nextLabel="Complete profile"
                  finalStep
                  saving={saving}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompleteProfile;
