import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/Userslice";
import { ISHARE_COLLECTION, ISharePost } from "../../../utils/Ishareschema";

// Firestore collection for handshake data
const HANDSHAKE_COLLECTION = "ishare_handshakes";

interface Handshake {
  id: string;
  postId: string;
  requesterId: string; // post owner (the one in need)
  helperId: string; // person who clicked "I Can Solve This"
  meetingPreference: string;
  contactMethod: string;
  contactDetail: string;
  message: string;
  createdAt: Timestamp;
  status: "pending" | "accepted" | "completed";
}

interface PeerHandshakePortalProps {
  post: ISharePost;
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp", icon: "📱" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "discord", label: "Discord", icon: "💬" },
  { value: "telegram", label: "Telegram", icon: "📡" },
  { value: "zoom", label: "Zoom / Video Call", icon: "🎥" },
  { value: "in_person", label: "In Person", icon: "🤝" },
];

const MEETING_PREFS = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
  "Flexible / async",
];

const PeerHandshakePortal: React.FC<PeerHandshakePortalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const user = useSelector(selectUser);
  const [existingHandshake, setExistingHandshake] = useState<Handshake | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    meetingPreference: "",
    contactMethod: "",
    contactDetail: "",
    message: "",
  });

  const isHelper = user?.uid === post.matchedUserId;
  const isRequester = user?.uid === post.userId;

  // Listen for existing handshake
  useEffect(() => {
    if (!user || !isOpen) return;
    const q = query(
      collection(db, HANDSHAKE_COLLECTION),
      where("postId", "==", post.id),
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setExistingHandshake({
          id: snap.docs[0].id,
          ...snap.docs[0].data(),
        } as Handshake);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user, post.id, isOpen]);

  const handleSubmit = async () => {
    if (!user) return;
    if (
      !form.contactMethod ||
      !form.contactDetail.trim() ||
      !form.message.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, HANDSHAKE_COLLECTION), {
        postId: post.id,
        requesterId: post.userId,
        helperId: post.matchedUserId ?? user.uid,
        meetingPreference: form.meetingPreference,
        contactMethod: form.contactMethod,
        contactDetail: form.contactDetail.trim(),
        message: form.message.trim(),
        createdAt: Timestamp.now(),
        status: "pending",
      });
      // Update post status to reflect handshake initiated
      await updateDoc(doc(db, ISHARE_COLLECTION, post.id), {
        status: "pending_match",
      });
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message ?? "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-purple-950/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl shadow-purple-950/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Secure Handshake
              </h2>
              <p className="text-purple-300/60 text-[11px] font-medium">
                Private peer channel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin w-7 h-7 text-purple-300"
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
            </div>
          ) : submitted || existingHandshake ? (
            /* ── Handshake exists / sent view ── */
            <div className="py-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-2xl mb-4">
                  🔐
                </div>
                <h3 className="text-lg font-black text-purple-950 mb-1">
                  Channel Open
                </h3>
                <p className="text-sm text-purple-950/50 font-medium leading-relaxed max-w-xs">
                  Your secure connection details have been shared. Reach out
                  using the method below.
                </p>
              </div>

              {existingHandshake && (
                <div className="bg-slate-50 rounded-2xl border border-purple-950/5 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {CONTACT_METHODS.find(
                        (m) => m.value === existingHandshake.contactMethod,
                      )?.icon ?? "📬"}
                    </span>
                    <div>
                      <p className="text-xs font-black text-purple-950/50 uppercase tracking-wide">
                        {
                          CONTACT_METHODS.find(
                            (m) => m.value === existingHandshake.contactMethod,
                          )?.label
                        }
                      </p>
                      <p className="text-sm font-black text-purple-950">
                        {existingHandshake.contactDetail}
                      </p>
                    </div>
                  </div>
                  {existingHandshake.meetingPreference && (
                    <div className="pt-2 border-t border-purple-950/5">
                      <p className="text-xs text-purple-950/40 font-medium">
                        Availability: {existingHandshake.meetingPreference}
                      </p>
                    </div>
                  )}
                  {existingHandshake.message && (
                    <div className="pt-2 border-t border-purple-950/5">
                      <p className="text-xs font-bold text-purple-950/50 uppercase tracking-wide mb-1">
                        Message
                      </p>
                      <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                        {existingHandshake.message}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Safety reminder */}
              <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <svg
                  className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  Always meet in public spaces first. Never send money before
                  verifying identity through the platform.
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <div className="space-y-5">
              {/* Post context */}
              <div className="bg-purple-50/60 border border-purple-100/60 rounded-xl px-4 py-3">
                <p className="text-[11px] font-black text-purple-950/40 uppercase tracking-wide mb-0.5">
                  Responding to
                </p>
                <p className="text-sm font-black text-purple-950 line-clamp-1">
                  {post.title}
                </p>
              </div>

              {/* Contact method */}
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-1">
                  Preferred contact method{" "}
                  <span className="text-purple-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CONTACT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, contactMethod: m.value }))
                      }
                      className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-center transition-all text-[11px] font-bold ${
                        form.contactMethod === m.value
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/8 text-purple-950/50 hover:border-purple-300 hover:bg-purple-50/40"
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact detail */}
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Your contact detail <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.contactDetail}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactDetail: e.target.value }))
                  }
                  placeholder="e.g. +234 800 000 0000 or handle@discord"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>

              {/* Meeting preference */}
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-1">
                  Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {MEETING_PREFS.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, meetingPreference: pref }))
                      }
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        form.meetingPreference === pref
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/8 text-purple-950/50 hover:border-purple-200"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Brief intro message <span className="text-purple-600">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Introduce yourself and explain how you can help with this request..."
                  rows={3}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-600 focus:bg-white transition-all resize-none"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 text-sm font-bold text-purple-950/40 hover:text-purple-950 py-3 rounded-xl border border-purple-950/10 hover:border-purple-950/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-[2] bg-purple-950 hover:bg-orange-500 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
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
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                      Open Secure Channel
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerHandshakePortal;
