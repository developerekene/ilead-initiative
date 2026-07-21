import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  selectNotifications,
  selectUnreadCount,
  formatRelativeTime,
  type Notification,
} from "../../redux/slices/notificationSlice";

/* ─── Styles helper (mirrors NotificationCenter) ─── */

const getTypeStyles = (type: Notification["type"]) => {
  switch (type) {
    case "ACCEPTED":
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        text: "text-emerald-700",
        icon: "✓",
      };
    case "RESCHEDULED":
      return {
        bg: "bg-amber-50",
        border: "border-amber-100",
        text: "text-amber-700",
        icon: "⏰",
      };
    case "COMPLETED":
      return {
        bg: "bg-purple-50",
        border: "border-purple-100",
        text: "text-purple-700",
        icon: "🎓",
      };
    case "NEW_CAMPAIGN":
      return {
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-700",
        icon: "🚀",
      };
    case "FLAG_POSTED":
      return {
        bg: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-700",
        icon: "📌",
      };
    case "NEED_FULFILLED":
      return {
        bg: "bg-teal-50",
        border: "border-teal-100",
        text: "text-teal-700",
        icon: "🤝",
      };
    case "GENERAL":
      return {
        bg: "bg-slate-50",
        border: "border-slate-100",
        text: "text-slate-700",
        icon: "💡",
      };
  }
};

/* Component */

const NotificationView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => n.isUnread)
      : notifications;

  const handleClick = (alert: Notification) => {
    if (alert.isUnread) {
      dispatch(markAsRead(alert.id));
    }
    navigate(`/notifications/${alert.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* HERO  */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Notifications
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Your <span className="text-orange-500">Activity Ledger</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
              Stay up to date with mentorship updates, campaign launches,
              community activity, and platform announcements — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TOOLBAR ─── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border transition-all duration-200 ${
                filter === "all"
                  ? "bg-purple-950 text-white border-purple-950 shadow-md"
                  : "bg-white text-purple-950/50 border-purple-950/10 hover:border-purple-950/30"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border transition-all duration-200 ${
                filter === "unread"
                  ? "bg-purple-950 text-white border-purple-950 shadow-md"
                  : "bg-white text-purple-950/50 border-purple-950/10 hover:border-purple-950/30"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs font-bold text-orange-500 hover:text-purple-950 transition-colors px-3 py-2"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => dispatch(clearNotifications())}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors px-3 py-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── LIST ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2.5rem] p-16 text-center space-y-4">
            <span className="text-5xl block">📥</span>
            <h3 className="text-xl font-black text-purple-950 tracking-tight">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              {filter === "unread"
                ? "You're all caught up! Check back later for new activity."
                : "When something happens — a campaign launch, mentorship update, or community activity — it will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((alert) => {
              const meta = getTypeStyles(alert.type);
              return (
                <div
                  key={alert.id}
                  onClick={() => handleClick(alert)}
                  className={`group relative bg-white border rounded-2xl p-4 sm:p-6 flex items-start gap-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    alert.isUnread
                      ? "border-orange-200/60 bg-orange-50/10"
                      : "border-purple-950/[0.04] hover:border-purple-950/10"
                  }`}
                >
                  {/* Unread indicator dot */}
                  {alert.isUnread && (
                    <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-orange-500 sm:hidden" />
                  )}

                  {/* Status icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border shadow-sm ${meta.bg} ${meta.border} ${meta.text}`}
                  >
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`text-sm sm:text-base font-black tracking-tight leading-snug ${
                          alert.isUnread
                            ? "text-purple-950"
                            : "text-purple-950/80"
                        }`}
                      >
                        {alert.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-purple-950/40 whitespace-nowrap shrink-0 mt-0.5">
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="pt-1.5 flex items-center gap-3 text-[10px] text-purple-950/40 font-bold uppercase tracking-wide">
                      <span>By: {alert.senderName}</span>
                      <span className="text-purple-950/20">•</span>
                      <span className="text-purple-950/30">
                        Ref: {alert.caseId}
                      </span>
                      {alert.isUnread && (
                        <>
                          <span className="text-purple-950/20">•</span>
                          <span className="text-orange-500">New</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, alert.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-red-50 text-purple-950/20 hover:text-red-400 shrink-0 self-start mt-1"
                    aria-label="Delete notification"
                    title="Remove"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationView;
