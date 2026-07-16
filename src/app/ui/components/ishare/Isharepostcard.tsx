import React from "react";
import { ISharePost, PostType } from "../../../utils/Ishareschema";
import FlagPostButton from "./Flagpostbutton";
import { useNavigate } from "react-router-dom";

const CATEGORY_LABELS: Record<string, string> = {
  skills: "Skills",
  hardware: "Hardware",
  mentorship: "Mentorship",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  skills: "bg-blue-50 text-blue-700 border-blue-100",
  hardware: "bg-emerald-50 text-emerald-700 border-emerald-100",
  mentorship: "bg-purple-50 text-purple-700 border-purple-100",
  other: "bg-slate-50 text-slate-600 border-slate-200",
};

interface ISharePostCardProps {
  post: ISharePost;
  mode: PostType;
}

const ISharePostCard: React.FC<ISharePostCardProps> = ({ post, mode }) => {
  const navigate = useNavigate();
  const goToPost = () => navigate(`/ishare/post/${post.id}`);

  const isOffer = mode === "offer_give";
  const timeAgo = (ts: any) => {
    if (!ts?.toDate) return "";
    const diff = Date.now() - ts.toDate().getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div
      className={`cursor-pointer bg-white border rounded-[1.75rem] p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group ${
        isOffer
          ? "border-orange-500/10 hover:border-orange-500/20 hover:shadow-orange-500/5"
          : "border-purple-950/5 hover:border-purple-950/10 hover:shadow-purple-950/5"
      }`}
      onClick={goToPost}
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
              CATEGORY_COLORS[post.category]
            }`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          {/* Type hint */}
          {isOffer ? (
            <span className="text-[11px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
              Offering
            </span>
          ) : (
            <span className="text-[11px] font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg">
              Needs help
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-purple-950/30">
            {timeAgo(post.timestamp)}
          </span>
          {/* Flag — stop bubbling so it doesn't trigger card navigation */}
          <span onClick={(e) => e.stopPropagation()}>
            <FlagPostButton postId={post.id} />
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-black text-purple-950 leading-snug mb-3 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
        {post.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-purple-950/55 font-medium leading-relaxed mb-6 line-clamp-3 flex-1">
        {post.description}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-950/5">
        {/* Author */}
        <div className="flex items-center gap-2.5 min-w-0">
          {post.anonymous || !post.photoURL ? (
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
          ) : (
            <img
              src={post.photoURL}
              alt=""
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          )}
          <span className="text-xs font-semibold text-purple-950/50 truncate">
            {post.anonymous
              ? "Anonymous"
              : (post.displayName ?? "Community Member")}
          </span>
        </div>

        {/* View button — explicit affordance (whole card is also clickable) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPost();
          }}
          className="shrink-0 text-[11px] font-black px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white"
        >
          View
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ISharePostCard;
