import React, { useState } from "react";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/User";
import { ISHARE_COLLECTION, ISharePost } from "../../../utils/Ishareschema";

interface FulfillNeedButtonProps {
  post: ISharePost;
  onMatched?: () => void;
}

const FulfillNeedButton: React.FC<FulfillNeedButtonProps> = ({
  post,
  onMatched,
}) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Can't fulfill your own post
  const isOwner = user?.uid === post.userId;
  const isAlreadyMatched =
    post.status === "pending_match" || post.status === "fulfilled";

  const handleFulfill = async () => {
    if (!user) {
      setError("Sign in to help someone.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, ISHARE_COLLECTION, post.id), {
        status: "pending_match",
        matchedUserId: user.uid,
      });
      setConfirmed(true);
      setShowConfirm(false);
      onMatched?.();
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isAlreadyMatched && !confirmed) {
    return (
      <span className="text-[11px] font-black text-purple-400 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg">
        {post.status === "pending_match" ? "Match Pending" : "Fulfilled"}
      </span>
    );
  }

  if (confirmed) {
    return (
      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
        <svg
          className="w-3.5 h-3.5"
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
        You're helping!
      </span>
    );
  }

  if (isOwner) {
    return (
      <span className="text-[11px] font-bold text-purple-950/30 px-3 py-1.5">
        Your post
      </span>
    );
  }

  return (
    <div className="relative">
      {/* Confirm popover */}
      {showConfirm && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-purple-950/10 rounded-2xl shadow-xl shadow-purple-950/10 p-4 z-20">
          <p className="text-xs font-black text-purple-950 mb-1">
            Confirm your help
          </p>
          <p className="text-[11px] text-purple-950/50 font-medium leading-relaxed mb-3">
            You'll be matched with this person. A private channel will open for
            you both.
          </p>
          {error && (
            <p className="text-[11px] text-red-500 font-semibold mb-2">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 text-xs font-bold text-purple-950/50 hover:text-purple-950 py-2 rounded-xl border border-purple-950/10 hover:border-purple-950/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFulfill}
              disabled={loading}
              className="flex-1 text-xs font-black text-white bg-purple-950 hover:bg-orange-500 disabled:opacity-60 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <svg
                  className="animate-spin w-3 h-3"
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
                "Yes, I'll help"
              )}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowConfirm((v) => !v)}
        className="text-[11px] font-black text-white bg-purple-950 hover:bg-orange-500 px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-orange-500/20 hover:-translate-y-0.5 transform"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          />
        </svg>
        I Can Solve This
      </button>
    </div>
  );
};

export default FulfillNeedButton;
