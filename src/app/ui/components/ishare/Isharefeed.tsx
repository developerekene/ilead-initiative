import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import {
  ISHARE_COLLECTION,
  ISharePost,
  PostType,
} from "../../../utils/Ishareschema";
import ISharePostCard from "./Isharepostcard";
import IShareSkeleton from "./Ishareskeleton";

interface IShareFeedProps {
  onCreatePost: (type: PostType) => void;
}

const IShareFeed: React.FC<IShareFeedProps> = ({ onCreatePost }) => {
  const [activeMode, setActiveMode] = useState<PostType>("offer_give");
  const [posts, setPosts] = useState<ISharePost[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore listener — swaps when toggle changes
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, ISHARE_COLLECTION),
      where("type", "==", activeMode),
      where("status", "==", "active"),
      orderBy("timestamp", "desc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ISharePost));
      setLoading(false);
    });

    return () => unsub();
  }, [activeMode]);

  const isGive = activeMode === "offer_give";

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950">
            iShare <span className="text-orange-500">Exchange</span>
          </h2>
          <p className="text-sm text-purple-950/50 font-medium mt-1.5 max-w-md">
            Give what you can. Ask for what you need. Every exchange strengthens
            the circle.
          </p>
        </div>

        {/* Post creation CTA */}
        <button
          onClick={() => onCreatePost(activeMode)}
          className="shrink-0 bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-purple-950/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {isGive ? "Post an Offer" : "Post a Request"}
        </button>
      </div>

      {/* ── Toggle ── */}
      <div className="flex items-center gap-0 bg-purple-950 p-1.5 rounded-2xl w-fit mb-10 shadow-xl shadow-purple-950/20">
        <button
          onClick={() => setActiveMode("offer_give")}
          className={`relative px-7 py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-300 cursor-pointer ${
            isGive
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "text-purple-300/60 hover:text-white"
          }`}
        >
          {isGive && (
            <span className="absolute inset-0 rounded-xl bg-orange-500/20 animate-ping" />
          )}
          <span className="relative flex items-center gap-2">
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
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              />
            </svg>
            iGive
          </span>
        </button>

        <button
          onClick={() => setActiveMode("request_need")}
          className={`relative px-7 py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-300 cursor-pointer ${
            !isGive
              ? "bg-white text-purple-950 shadow-lg shadow-white/10"
              : "text-purple-300/60 hover:text-white"
          }`}
        >
          {!isGive && (
            <span className="absolute inset-0 rounded-xl bg-white/20 animate-ping" />
          )}
          <span className="relative flex items-center gap-2">
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
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
            iNeed
          </span>
        </button>
      </div>

      {/* ── Feed Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <IShareSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${isGive ? "bg-orange-50 border border-orange-100" : "bg-purple-50 border border-purple-100"}`}
          >
            <svg
              className={`w-8 h-8 ${isGive ? "text-orange-400" : "text-purple-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-black text-purple-950 mb-2">
            {isGive ? "No offers yet" : "No requests yet"}
          </h3>
          <p className="text-sm text-purple-950/50 font-medium max-w-xs leading-relaxed">
            {isGive
              ? "Be the first to offer your skills, hardware, or mentorship to the community."
              : "No one has posted a need yet. Your request could be the first step toward a solution."}
          </p>
          <button
            onClick={() => onCreatePost(activeMode)}
            className={`mt-6 font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 ${isGive ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-purple-950 hover:bg-purple-800 text-white"}`}
          >
            {isGive ? "+ Post an Offer" : "+ Post a Request"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${i * 60}ms`,
                animationFillMode: "both",
              }}
            >
              <ISharePostCard post={post} mode={activeMode} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.35s ease-out; }
      `}</style>
    </section>
  );
};

export default IShareFeed;
