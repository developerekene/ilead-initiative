import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/User";
import { addNotification } from "../../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";

const FLAG_REASONS = [
  "Spam or misleading",
  "Inappropriate content",
  "Scam or fraud attempt",
  "Harassment or abuse",
  "Violates community guidelines",
  "Other",
];

const FLAGS_COLLECTION = "ishare_flags";

interface FlagPostButtonProps {
  postId: string;
}

const POPOVER_WIDTH = 240;

const FlagPostButton: React.FC<FlagPostButtonProps> = ({ postId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const top = rect.bottom + 6;
      const left = Math.max(8, rect.right - POPOVER_WIDTH);
      setPopoverPos({ top, left });
    }
    setOpen((v) => !v);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    const closeOnScroll = () => setOpen(false);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!selected || !user) return;
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, FLAGS_COLLECTION), {
        postId,
        reportedBy: user.uid,
        reason: selected,
        createdAt: Timestamp.now(),
        reviewed: false,
      });
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `flag-${postId}`,
          type: "FLAG_POSTED",
          title: "Flag Submitted",
          message:
            "Thank you. Your report has been received and will be reviewed by our team.",
          timestamp: "Just now",
          isUnread: true,
          senderName: user.displayName || "You",
        }),
      );
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setSelected("");
      }, 1800);
    } catch (err) {
      console.error("Flag submission failed:", err);
      setError("Couldn't submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="w-6 h-6 rounded-md flex items-center justify-center text-purple-950/20 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
        aria-label="Flag this post"
        title="Flag post"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18M3 6l9-3 9 3v9l-9 3-9-3V6z"
          />
        </svg>
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "fixed",
              top: popoverPos.top,
              left: popoverPos.left,
              width: POPOVER_WIDTH,
              zIndex: 9999,
            }}
            className="bg-white border border-purple-950/10 rounded-2xl shadow-xl shadow-purple-950/10 p-3"
          >
            {done ? (
              <div className="flex items-center gap-2 px-2 py-3 text-emerald-600">
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
                <span className="text-xs font-black">Report submitted</span>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest px-1 mb-2">
                  Report reason
                </p>
                <div className="space-y-0.5 mb-3">
                  {FLAG_REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(r);
                      }}
                      className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                        selected === r
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "text-purple-950/60 hover:bg-slate-50 hover:text-purple-950"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className="text-[11px] text-red-500 font-semibold px-1 mb-2">
                    {error}
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  disabled={!selected || submitting}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
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
                    "Submit Report"
                  )}
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default FlagPostButton;
