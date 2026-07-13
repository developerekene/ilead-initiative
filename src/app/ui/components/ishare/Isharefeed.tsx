import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../../../firebase";
import {
  ISHARE_COLLECTION,
  ISharePost,
  PostType,
} from "../../../utils/Ishareschema";
import ISharePostCard from "./Isharepostcard";
import IShareSkeleton from "./Ishareskeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { selectIsLoggedIn } from "../../../redux/slices/User";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface IShareFeedProps {
  onCreatePost: (type: PostType) => void;
}

const IShareFeed: React.FC<IShareFeedProps> = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [activeMode, setActiveMode] = useState<PostType>("offer_give");
  const [posts, setPosts] = useState<ISharePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isGive = activeMode === "offer_give";

  // ── Auth gate for post creation ──
  const handleCreatePost = (type: PostType) => {
    if (!isLoggedIn) {
      toast.error("You need to be signed in to post.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", { state: { from: location } });
      return;
    }
    onCreatePost(type);
  };

  // ── Real-time Firestore listener — swaps when toggle changes ──
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, ISHARE_COLLECTION),
      where("type", "==", activeMode),
      where("status", "==", "active"),
      orderBy("timestamp", "desc"),
      limit(30),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ISharePost),
        );
        setLoading(false);
      },
      (err) => {
        console.error("iShare feed listener error:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [activeMode]);

  // Clear search when switching tabs so you don't land on an empty view
  useEffect(() => {
    setSearchQuery("");
  }, [activeMode]);

  // ── Client-side filter over the loaded posts ──
  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.resourceType ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950">
            iShare <span className="text-orange-500">Exchange</span>
          </h2>
          <p className="text-sm text-purple-950/50 font-medium mt-1.5 max-w-md">
            Give what you can. Ask for what you need. Every exchange strengthens
            the circle.
          </p>
        </div>

        {/* Search + Post CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-950/30 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isGive ? "Search offers..." : "Search requests..."}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-purple-950/10 bg-slate-50 text-purple-950 placeholder:text-purple-950/30 font-medium text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-purple-950/30 hover:text-purple-950 hover:bg-purple-950/5 transition-all text-xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => handleCreatePost(activeMode)}
            className="shrink-0 bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 hover:shadow-purple-950/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
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

      {/* Result count — only while searching */}
      {!loading && searchQuery && (
        <p className="text-xs font-bold text-purple-950/40 mb-5">
          {filteredPosts.length}{" "}
          {filteredPosts.length === 1 ? "result" : "results"} for "{searchQuery}
          "
        </p>
      )}

      {/* ── Feed Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <IShareSkeleton key={i} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
              isGive
                ? "bg-orange-50 border border-orange-100"
                : "bg-purple-50 border border-purple-100"
            }`}
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

          {searchQuery ? (
            /* No search matches */
            <>
              <h3 className="text-lg font-black text-purple-950 mb-2">
                No matches found
              </h3>
              <p className="text-sm text-purple-950/50 font-medium max-w-xs leading-relaxed">
                Nothing matched "{searchQuery}". Try a different term or clear
                your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 bg-slate-50 hover:bg-slate-100 border border-purple-950/10 text-purple-950 font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Clear search
              </button>
            </>
          ) : (
            /* Genuinely empty feed */
            <>
              <h3 className="text-lg font-black text-purple-950 mb-2">
                {isGive ? "No offers yet" : "No requests yet"}
              </h3>
              <p className="text-sm text-purple-950/50 font-medium max-w-xs leading-relaxed">
                {isGive
                  ? "Be the first to offer your skills, hardware, or mentorship to the community."
                  : "No one has posted a need yet. Your request could be the first step toward a solution."}
              </p>
              <button
                onClick={() => handleCreatePost(activeMode)}
                className={`mt-6 font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 ${
                  isGive
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-purple-950 hover:bg-purple-800 text-white"
                }`}
              >
                {isGive ? "+ Post an Offer" : "+ Post a Request"}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post, i) => (
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
