import React, { useState } from "react";
import { ISharePost, PostType } from "../../../utils/Ishareschema";
import FulfillNeedButton from "./Fulfillneedbutton";
import FlagPostButton from "./Flagpostbutton";

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
      className={`bg-white border rounded-[1.75rem] p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group ${
        isOffer
          ? "border-orange-500/10 hover:border-orange-500/20 hover:shadow-orange-500/5"
          : "border-purple-950/5 hover:border-purple-950/10 hover:shadow-purple-950/5"
      }`}
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
            CATEGORY_COLORS[post.category]
          }`}
        >
          {CATEGORY_LABELS[post.category]}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-purple-950/30">
            {timeAgo(post.timestamp)}
          </span>
          {/* Ticket 16 — flag */}
          <FlagPostButton postId={post.id} />
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
        <div className="flex items-center gap-2.5">
          {post.anonymous || !post.photoURL ? (
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
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
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="text-xs font-semibold text-purple-950/50">
            {post.anonymous
              ? "Anonymous"
              : (post.displayName ?? "Community Member")}
          </span>
        </div>

        {/* Action — only shown on iNeed posts */}
        {!isOffer && <FulfillNeedButton post={post} />}

        {isOffer && (
          <span className="text-[11px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg">
            Offering
          </span>
        )}
      </div>
    </div>
  );
};

export default ISharePostCard;
