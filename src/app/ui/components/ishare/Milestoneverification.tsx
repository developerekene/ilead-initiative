import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  Timestamp,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/User";
import { ISHARE_COLLECTION, ISharePost } from "../../../utils/Ishareschema";

// Firestore collection for feedback / milestone records
const MILESTONES_COLLECTION = "ishare_milestones";
// Global stats document path
const GLOBAL_STATS_DOC = "meta/ishare_global_stats";

interface MilestoneVerificationProps {
  post: ISharePost;
  isOpen: boolean;
  onClose: () => void;
  onFulfilled?: () => void;
}

const STAR_RATINGS = [1, 2, 3, 4, 5];

const FEEDBACK_TAGS = [
  "Helpful & clear",
  "Went above expectations",
  "Very responsive",
  "Professional",
  "Generous",
  "Would connect again",
];

const MilestoneVerification: React.FC<MilestoneVerificationProps> = ({
  post,
  isOpen,
  onClose,
  onFulfilled,
}) => {
  const user = useSelector(selectUser);
  const [step, setStep] = useState<"confirm" | "feedback" | "done">("confirm");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.uid === post.userId;

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const handleMarkFulfilled = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      // 1. Update post status → fulfilled
      await updateDoc(doc(db, ISHARE_COLLECTION, post.id), {
        status: "fulfilled",
        fulfilledAt: Timestamp.now(),
      });
      setStep("feedback");
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      // 2. Write milestone feedback record
      await addDoc(collection(db, MILESTONES_COLLECTION), {
        postId: post.id,
        postType: post.type,
        reviewerId: user.uid,
        reviewedUserId:
          post.type === "request_need" ? post.matchedUserId : post.userId,
        rating,
        tags: selectedTags,
        comment: freeText.trim(),
        createdAt: Timestamp.now(),
      });

      // 3. Increment global stats counters
      await setDoc(
        doc(db, GLOBAL_STATS_DOC),
        {
          totalFulfilled: increment(1),
          ...(post.category === "mentorship" && {
            mentorshipHours: increment(2), // each mentorship post ~= 2hrs
          }),
          ...(post.category === "hardware" && {
            equipmentDeployed: increment(1),
          }),
        },
        { merge: true },
      );

      setStep("done");
      onFulfilled?.();
    } catch (e: any) {
      setError(e.message ?? "Could not save feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-purple-950/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl shadow-purple-950/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Milestone Verification
              </h2>
              <p className="text-emerald-100/70 text-[11px] font-medium">
                Confirm this exchange is complete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6">
          {/* ── Step: Confirm ── */}
          {step === "confirm" && (
            <div className="space-y-5">
              <div className="bg-slate-50 rounded-2xl border border-purple-950/5 p-4">
                <p className="text-[11px] font-black text-purple-950/40 uppercase tracking-wide mb-1">
                  {post.type === "request_need" ? "Request" : "Offer"}
                </p>
                <p className="text-sm font-black text-purple-950 line-clamp-2">
                  {post.title}
                </p>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <svg
                  className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  By marking this as fulfilled, you confirm the exchange has
                  been completed successfully. This action will update the
                  community stats and cannot be undone.
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 text-sm font-bold text-purple-950/40 hover:text-purple-950 py-3 rounded-xl border border-purple-950/10 hover:border-purple-950/20 transition-all"
                >
                  Not yet
                </button>
                <button
                  onClick={handleMarkFulfilled}
                  disabled={submitting}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
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
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      Mark as Fulfilled
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step: Feedback ── */}
          {step === "feedback" && (
            <div className="space-y-5">
              <div className="text-center pb-2">
                <p className="text-sm font-black text-purple-950 mb-1">
                  How did it go?
                </p>
                <p className="text-xs text-purple-950/40 font-medium">
                  Your feedback helps the community trust system
                </p>
              </div>

              {/* Star rating */}
              <div className="flex justify-center gap-2">
                {STAR_RATINGS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "text-orange-400"
                          : "text-slate-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-bold text-purple-950/50 mb-2 pl-1">
                  What stood out? (optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-purple-950 text-white border-purple-950"
                          : "bg-slate-50 text-purple-950/50 border-purple-950/8 hover:border-purple-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free text */}
              <div>
                <label className="text-xs font-bold text-purple-950/50 block mb-1.5 pl-1">
                  Leave a note (optional)
                </label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Share anything about the experience..."
                  rows={3}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all resize-none"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleSubmitFeedback()}
                  disabled={submitting || rating === 0}
                  className="w-full bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
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
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
              <button
                onClick={() => {
                  setStep("done");
                  onFulfilled?.();
                }}
                className="w-full text-xs font-bold text-purple-950/30 hover:text-purple-950/60 transition-colors text-center"
              >
                Skip feedback
              </button>
            </div>
          )}

          {/* ── Step: Done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-3xl mb-5">
                🏆
              </div>
              <h3 className="text-xl font-black text-purple-950 mb-2">
                Exchange Complete!
              </h3>
              <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-2 max-w-xs">
                This milestone has been recorded and the community impact stats
                have been updated.
              </p>
              <p className="text-xs text-orange-500 font-black mb-7">
                Thank you for lifting as you climb. 🙌
              </p>
              <button
                onClick={onClose}
                className="bg-purple-950 hover:bg-orange-500 text-white font-black px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
              >
                Back to Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneVerification;
