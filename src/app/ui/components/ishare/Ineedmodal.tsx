import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/User";
import { addNotification } from "../../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";
import {
  ISHARE_COLLECTION,
  PostCategory,
  buildISharePost,
} from "../../../utils/Ishareschema";
import { FormPanel } from "../formcomponent/FormComponents";

interface INeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

const CATEGORIES: {
  value: PostCategory;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    value: "skills",
    label: "Skills",
    icon: "💡",
    desc: "Code, design, writing, strategy",
  },
  {
    value: "hardware",
    label: "Hardware",
    icon: "💻",
    desc: "Devices, peripherals, equipment",
  },
  {
    value: "mentorship",
    label: "Mentorship",
    icon: "🧭",
    desc: "Coaching, guidance, reviews",
  },
  {
    value: "other",
    label: "Other",
    icon: "🤝",
    desc: "Any form of community support",
  },
];

const RESOURCE_TYPES = [
  "Time / Availability",
  "Physical Equipment",
  "Digital Resource",
  "Knowledge / Expertise",
  "Financial Support",
  "Access / Connection",
];

const INeedModal: React.FC<INeedModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    resourceType: "",
    category: "" as PostCategory | "",
    description: "",
    anonymous: false,
  });

  const reset = () => {
    setStep(1);
    setLoading(false);
    setError(null);
    setSubmitted(false);
    setDisclaimerAccepted(false);
    setForm({
      title: "",
      resourceType: "",
      category: "",
      description: "",
      anonymous: false,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canProceedStep1 = form.title.trim().length >= 3 && form.resourceType;
  const canProceedStep2 = !!form.category;
  const canSubmit = form.description.trim().length >= 20 && disclaimerAccepted;

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be signed in to post.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = buildISharePost({
        userId: user.uid,
        type: "request_need",
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category as PostCategory,
        resourceType: form.resourceType, // now persisted
        safetyAcknowledged: disclaimerAccepted, // consent audit trail
        anonymous: form.anonymous,
        displayName: form.anonymous ? null : user.displayName,
        photoURL: form.anonymous ? null : user.photoURL,
      });
      await addDoc(collection(db, ISHARE_COLLECTION), payload);
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `need-${Date.now()}`,
          type: "GENERAL",
          title: "Request Posted!",
          message: ` ${form.title}`,
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: user.displayName || "You",
          metadata: {
            "Request Title": form.title,
            "Resource Type": form.resourceType,
            Category: form.category,
            Description: form.description,
          },
        }),
      );
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? "Request Posted" : "iNeed — Post a Request"}
      badge={submitted ? "Complete" : `Step ${step} of 3`}
      badgeVariant="purple"
    >
      {submitted ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center mb-5 text-3xl">
            🙌
          </div>
          <h3 className="text-xl font-black text-purple-950 mb-2">
            Request Posted!
          </h3>
          <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-7 max-w-xs">
            Your request is live. A community member will reach out when they
            can help. Stay tuned.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-950 hover:bg-orange-500 text-white font-black px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
          >
            Back to Feed
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

          {/* ── Step 1: Title + Resource Type ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Request Title <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Need a laptop for remote work"
                  maxLength={80}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-purple-950/30 pl-0.5 mt-1 block">
                  {form.title.length}/80
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  What type of resource do you need?{" "}
                  <span className="text-purple-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RESOURCE_TYPES.map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, resourceType: rt }))
                      }
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                        form.resourceType === rt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Category ── */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-purple-950/70 pl-0.5 mb-3">
                Category <span className="text-purple-600">*</span>
              </p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, category: cat.value }))
                  }
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                    form.category === cat.value
                      ? "bg-purple-50 border-purple-400"
                      : "bg-slate-50 border-purple-950/10 hover:border-purple-300 hover:bg-purple-50/40"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="text-sm font-black text-purple-950">
                      {cat.label}
                    </p>
                    <p className="text-xs text-purple-950/50 font-medium">
                      {cat.desc}
                    </p>
                  </div>
                  {form.category === cat.value && (
                    <svg
                      className="ml-auto w-5 h-5 text-purple-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 3: Description + Safety Disclaimer + Anonymous ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Describe your need in detail{" "}
                  <span className="text-purple-600">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Explain your situation clearly — what you need, why, how it will be used, and any relevant context that will help someone assist you..."
                  rows={5}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all resize-none"
                />
                <span className="text-[11px] text-purple-950/30 pl-0.5 mt-1 block">
                  {form.description.length} chars{" "}
                  {form.description.length < 20 && `(min 20)`}
                </span>
              </div>

              {/* ⚠️ Safety Disclaimer Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <svg
                    className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-black text-amber-800 uppercase tracking-wide mb-1">
                      Community Safety Reminder
                    </p>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      iLEAD is a trust-based community. Never share financial
                      account details, home addresses, or sensitive personal
                      data in your post. All exchanges happen through our
                      verified peer channel after matching.
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-amber-800">
                    I understand and agree to these safety guidelines
                  </span>
                </label>
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3.5 rounded-xl border border-purple-950/[0.03]">
                <div>
                  <p className="text-sm font-bold text-purple-950/80">
                    Post anonymously
                  </p>
                  <p className="text-xs text-purple-950/40 font-medium">
                    Your name won't appear on this request
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, anonymous: !p.anonymous }))
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    form.anonymous ? "bg-purple-950" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      form.anonymous ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
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
                    Posting...
                  </>
                ) : (
                  "Post Request 🙌"
                )}
              </button>
            )}
          </div>
        </>
      )}
    </FormPanel>
  );
};

export default INeedModal;
