import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ISHARE_COLLECTION, ISharePost } from "../../../utils/Ishareschema";
import { selectUser } from "../../../redux/slices/User";
import toast from "react-hot-toast";

interface Interest {
  id: string; // == userId
  userId: string;
  displayName: string | null;
  photoURL: string | null;
  message: string;
  createdAt: any;
}

const CATEGORY_STYLES: Record<string, string> = {
  skills: "bg-blue-50 text-blue-600 border-blue-100",
  hardware: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mentorship: "bg-purple-50 text-purple-700 border-purple-100",
  other: "bg-slate-50 text-slate-500 border-slate-200",
};

// Availability presentation, driven purely by post.status
const AVAILABILITY: Record<
  string,
  { label: string; note: string; box: string; dot: string }
> = {
  active: {
    label: "Available",
    note: "This is open and accepting interest from the community.",
    box: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  pending_match: {
    label: "In Progress",
    note: "The owner is coordinating with an interested member.",
    box: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
  },
  fulfilled: {
    label: "Fulfilled",
    note: "This exchange is complete. Thank you for giving back.",
    box: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
  },
  archived: {
    label: "Ended",
    note: "This post is no longer available.",
    box: "bg-slate-50 border-slate-200 text-slate-500",
    dot: "bg-slate-400",
  },
};

const formatTimestamp = (ts: any): string => {
  try {
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const getInitials = (name: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ISharePostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [post, setPost] = useState<ISharePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interests
  const [interests, setInterests] = useState<Interest[]>([]);
  const [myInterest, setMyInterest] = useState<Interest | null>(null);
  const [interestMessage, setInterestMessage] = useState("");
  const [submittingInterest, setSubmittingInterest] = useState(false);

  // Owner edit
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [busyStatus, setBusyStatus] = useState(false);

  const isOwner = !!user?.uid && user.uid === post?.userId;

  // Fetch the post
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("No post specified.");
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, ISHARE_COLLECTION, postId));
        if (!snap.exists()) {
          setError("This post doesn't exist or has been removed.");
        } else {
          const data = { id: snap.id, ...snap.data() } as ISharePost;
          setPost(data);
          setEditForm({ title: data.title, description: data.description });
        }
      } catch (err) {
        console.error("Failed to load iShare post:", err);
        setError("We couldn't load this post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Listen to interests (live)
  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, ISHARE_COLLECTION, postId, "interests"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Interest,
        );
        setInterests(list);
        setMyInterest(list.find((i) => i.userId === user?.uid) ?? null);
      },
      (err) => console.error("Interests listener error:", err),
    );
    return () => unsub();
  }, [postId, user?.uid]);

  // Express interest
  const handleExpressInterest = async () => {
    if (!user?.uid) {
      toast.error("Please sign in to show interest.");
      navigate("/sign-in");
      return;
    }
    if (!postId) return;
    setSubmittingInterest(true);
    try {
      await setDoc(doc(db, ISHARE_COLLECTION, postId, "interests", user.uid), {
        userId: user.uid,
        displayName: user.displayName ?? "Community Member",
        photoURL: user.photoURL ?? null,
        message: interestMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setInterestMessage("");
      toast.success("Interest sent! The owner can now see you're keen.");
    } catch (err) {
      console.error("Express interest failed:", err);
      toast.error("Couldn't send interest. Please try again.");
    } finally {
      setSubmittingInterest(false);
    }
  };

  const handleWithdrawInterest = async () => {
    if (!user?.uid || !postId) return;
    try {
      await deleteDoc(
        doc(db, ISHARE_COLLECTION, postId, "interests", user.uid),
      );
      toast("Interest withdrawn.", {
        style: { background: "#1e1b4b", color: "#fff" },
      });
    } catch (err) {
      console.error("Withdraw failed:", err);
      toast.error("Couldn't withdraw. Please try again.");
    }
  };

  // Owner: status transitions
  const setStatus = async (status: ISharePost["status"]) => {
    if (!postId || !post) return;
    setBusyStatus(true);
    try {
      const payload: Record<string, any> = { status };
      if (status === "fulfilled") payload.fulfilledAt = serverTimestamp();
      await updateDoc(doc(db, ISHARE_COLLECTION, postId), payload);
      setPost({ ...post, status });
      toast.success(`Post marked ${status.replace("_", " ")}.`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Couldn't update status. Please try again.");
    } finally {
      setBusyStatus(false);
    }
  };

  // Owner: save edits
  const handleSaveEdit = async () => {
    if (!postId || !post) return;
    if (editForm.title.trim().length < 3) {
      toast.error("Title is too short.");
      return;
    }
    if (editForm.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters.");
      return;
    }
    setSavingEdit(true);
    try {
      await updateDoc(doc(db, ISHARE_COLLECTION, postId), {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      });
      setPost({
        ...post,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      });
      setEditing(false);
      toast.success("Post updated.");
    } catch (err) {
      console.error("Edit save failed:", err);
      toast.error("Couldn't save changes. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-24 bg-slate-100 rounded-lg" />
          <div className="h-10 w-3/4 bg-slate-100 rounded-xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-14 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-purple-950/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-purple-950 mb-2">
          Post unavailable
        </h1>
        <p className="text-sm text-purple-950/50 font-medium mb-8 max-w-sm mx-auto">
          {error ?? "Something went wrong."}
        </p>
        <button
          onClick={() => navigate("/iShare")}
          className="bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
        >
          Back to iShare
        </button>
      </div>
    );
  }

  const isGive = post.type === "offer_give";
  const isRequest = post.type === "request_need";
  const isActive = post.status === "active";
  const avail = AVAILABILITY[post.status] ?? AVAILABILITY.active;
  const displayName = post.anonymous
    ? "Anonymous Member"
    : (post.displayName ?? "Community Member");

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
      {/* Back link */}
      <button
        onClick={() => navigate("/iShare")}
        className="text-sm font-bold text-purple-950/40 hover:text-purple-950 transition-colors mb-8 flex items-center gap-1.5"
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to iShare
      </button>

      {/* Availability banner */}
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 mb-6 ${avail.box}`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${avail.dot}`}
        />
        <div>
          <p className="text-sm font-black">{avail.label}</p>
          <p className="text-xs font-medium opacity-80">{avail.note}</p>
        </div>
      </div>

      {/* Type + category badges */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            isGive
              ? "bg-orange-50 text-orange-600 border-orange-200"
              : "bg-purple-50 text-purple-600 border-purple-200"
          }`}
        >
          {isGive ? "iGive — Offer" : "iNeed — Request"}
        </span>
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.other
          }`}
        >
          {post.category}
        </span>
      </div>

      {/* Title + description — editable for owner */}
      {editing ? (
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Title
            </label>
            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, title: e.target.value }))
              }
              maxLength={80}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={6}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setEditForm({
                  title: post.title,
                  description: post.description,
                });
              }}
              className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-purple-950/60 font-bold text-sm rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={savingEdit}
              className="flex-[2] py-3 bg-purple-950 hover:bg-orange-500 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all"
            >
              {savingEdit ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950 mb-4 break-words">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-medium text-purple-950/40 mb-8 pb-8 border-b border-purple-950/5">
            {post.resourceType && <span>{post.resourceType}</span>}
            <span>{formatTimestamp(post.timestamp)}</span>
          </div>
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
              {isGive ? "About this offer" : "About this request"}
            </p>
            <p className="text-base text-purple-950/80 font-medium leading-relaxed whitespace-pre-wrap break-words">
              {post.description}
            </p>
          </div>
        </>
      )}

      {/* Safety reminder for requests */}
      {isRequest && !editing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
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
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            Keep exchanges within iLEAD's verified channels. Never share
            financial details, home addresses, or sensitive personal data.
          </p>
        </div>
      )}

      {/* Poster identity */}
      <div className="flex items-center gap-3 mb-10">
        {post.photoURL && !post.anonymous ? (
          <img
            src={post.photoURL}
            alt={displayName}
            className="w-11 h-11 rounded-full object-cover border-2 border-purple-100"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-purple-700 text-white flex items-center justify-center text-sm font-black">
            {post.anonymous ? "?" : getInitials(post.displayName ?? null)}
          </div>
        )}
        <div>
          <p className="text-sm font-black text-purple-950">{displayName}</p>
          <p className="text-[11px] text-purple-950/40 font-medium">
            {isGive ? "Offering to the community" : "Requesting support"}
            {isOwner && " · You"}
          </p>
        </div>
      </div>

      {/* OWNER VIEW: manage */}
      {isOwner ? (
        <div className="border-t border-purple-950/5 pt-8 space-y-6">
          {!editing && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setEditing(true)}
                className="flex-1 min-w-[140px] py-3 bg-slate-50 hover:bg-slate-100 border border-purple-950/10 text-purple-950 font-bold text-sm rounded-xl transition-all"
              >
                Edit Post
              </button>
              {post.status !== "fulfilled" && (
                <button
                  onClick={() => setStatus("fulfilled")}
                  disabled={busyStatus}
                  className="flex-1 min-w-[140px] py-3 bg-purple-950 hover:bg-orange-500 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all"
                >
                  Mark Fulfilled
                </button>
              )}
              {post.status !== "archived" ? (
                <button
                  onClick={() => setStatus("archived")}
                  disabled={busyStatus}
                  className="flex-1 min-w-[140px] py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-sm rounded-xl transition-all"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() => setStatus("active")}
                  disabled={busyStatus}
                  className="flex-1 min-w-[140px] py-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-sm rounded-xl transition-all"
                >
                  Reopen
                </button>
              )}
            </div>
          )}

          {/* Interested members */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
              Interested Members ({interests.length})
            </p>
            {interests.length === 0 ? (
              <p className="text-sm text-purple-950/40 font-medium">
                No one has shown interest yet.
              </p>
            ) : (
              <div className="space-y-3">
                {interests.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start gap-3 bg-slate-50 border border-purple-950/5 rounded-2xl p-4"
                  >
                    {it.photoURL ? (
                      <img
                        src={it.photoURL}
                        alt={it.displayName ?? ""}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {getInitials(it.displayName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-black text-purple-950">
                        {it.displayName ?? "Community Member"}
                      </p>
                      {it.message && (
                        <p className="text-xs text-purple-950/60 font-medium mt-0.5 break-words">
                          {it.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* HELPER VIEW: express interest */
        <div className="border-t border-purple-950/5 pt-8">
          {!isActive ? (
            <div className="text-center py-4">
              <p className="text-sm font-bold text-purple-950/50">
                This post is {avail.label.toLowerCase()} and no longer accepting
                interest.
              </p>
            </div>
          ) : myInterest ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-sm font-black text-green-700 mb-1">
                You've shown interest
              </p>
              <p className="text-xs text-green-600/80 font-medium mb-4">
                The owner can see you're keen. They'll reach out to coordinate.
              </p>
              <button
                onClick={handleWithdrawInterest}
                className="text-xs font-bold text-green-700 hover:text-green-900 underline"
              >
                Withdraw interest
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                {isGive ? "Request this offer" : "Offer to help"}
              </p>
              <textarea
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                placeholder={
                  isGive
                    ? "Add a short note about why you'd like this (optional)..."
                    : "Add a short note about how you can help (optional)..."
                }
                rows={3}
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
              />
              <button
                onClick={handleExpressInterest}
                disabled={submittingInterest}
                className={`w-full font-black py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 disabled:opacity-50 ${
                  isGive
                    ? "bg-orange-500 hover:bg-purple-950 text-white"
                    : "bg-purple-950 hover:bg-orange-500 text-white"
                }`}
              >
                {submittingInterest
                  ? "Sending..."
                  : isGive
                    ? "Show Interest"
                    : "I Can Help"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ISharePostDetails;
