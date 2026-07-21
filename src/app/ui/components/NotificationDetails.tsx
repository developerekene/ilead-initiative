import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  selectNotifications,
  formatRelativeTime,
  type NotificationType,
} from "../../redux/slices/notificationSlice";

/* ─── Type style map ───────────────────────────────── */

const TYPE_META: Record<
  NotificationType,
  { label: string; bg: string; border: string; text: string; icon: string }
> = {
  ACCEPTED: {
    label: "Accepted",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "✓",
  },
  RESCHEDULED: {
    label: "Rescheduled",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "⏰",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "🎓",
  },
  NEW_CAMPAIGN: {
    label: "Campaign",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "🚀",
  },
  FLAG_POSTED: {
    label: "Flag",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: "📌",
  },
  NEED_FULFILLED: {
    label: "Fulfilled",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    icon: "🤝",
  },
  GENERAL: {
    label: "General",
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    icon: "💡",
  },
};

/* ─── Action guide per type ────────────────────────── */

const getAction = (
  type: NotificationType,
  caseId: string,
): { label: string; to: string } | null => {
  switch (type) {
    case "ACCEPTED":
    case "RESCHEDULED":
    case "COMPLETED":
      return { label: "View Case Details", to: `/dashboard/cases/${caseId}` };
    case "NEW_CAMPAIGN":
      return {
        label: "View Campaign",
        to: `/all-Campaign/campaign-details/${caseId}`,
      };
    case "NEED_FULFILLED":
    case "FLAG_POSTED":
    case "GENERAL":
      return { label: "View in iSHARE", to: `/ishare/post/${caseId}` };
    default:
      return null;
  }
};

/* ─── Component ────────────────────────────────────── */

const NotificationDetails: React.FC = () => {
  const { notificationId } = useParams<{ notificationId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const notification = notifications.find((n) => n.id === notificationId);

  /* Mark as read on first view */
  useEffect(() => {
    if (notification?.isUnread) {
      dispatch(markAsRead(notification.id));
    }
  }, [notification?.id, notification?.isUnread, dispatch]);

  /* Loading / not-found state */
  if (!notification) {
    return (
      <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-24 text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <h1 className="text-3xl font-black text-purple-950 mb-2">
            Notification not found
          </h1>
          <p className="text-sm text-purple-950/60 font-medium mb-8">
            This notification may have been deleted or the link is invalid.
          </p>
          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            ← Back to notifications
          </Link>
        </section>
      </div>
    );
  }

  const meta = TYPE_META[notification.type];
  const action = getAction(notification.type, notification.caseId);

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── BACK BAR ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-950/50 hover:text-orange-500 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>
      </section>

      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Type badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg border ${meta.bg} ${meta.border} ${meta.text}`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight pt-1">
              {notification.title}
            </h1>

            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-3xl">
              {notification.message}
            </p>
          </div>

          {/* Right sidebar meta card */}
          <div className="lg:col-span-4 lg:pt-6">
            <div className="bg-slate-50/60 border border-purple-950/[0.03] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest">
                  Status
                </span>
                {notification.isUnread ? (
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Unread
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    Read
                  </span>
                )}
              </div>

              <div className="h-px bg-purple-950/5" />

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Sent by
                  </span>
                  <span className="text-sm font-bold text-purple-950 mt-0.5 block">
                    {notification.senderName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Received
                  </span>
                  <span className="text-sm font-bold text-purple-950 mt-0.5 block">
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Reference ID
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-950/60 mt-0.5 block break-all">
                    {notification.caseId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Notification ID
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-950/40 mt-0.5 block break-all">
                    {notification.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL MESSAGE BODY ─── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="max-w-4xl">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
            Message Details
          </h2>

          <div className="bg-slate-50/30 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-purple-950/5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border shadow-sm ${meta.bg} ${meta.border} ${meta.text}`}
              >
                {meta.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-purple-950 tracking-tight">
                  {notification.title}
                </h3>
                <span className="text-xs font-semibold text-purple-950/40">
                  {formatRelativeTime(notification.timestamp)} • By{" "}
                  {notification.senderName}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-purple-950/70 font-medium leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </p>

            {/* ─── Structured metadata ─── */}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div className="mt-8 pt-6 border-t border-purple-950/5">
                <h4 className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest mb-4">
                  Detailed Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block mb-0.5">
                        {key}
                      </span>
                      <span className="text-sm font-semibold text-purple-950/80 leading-snug block break-words">
                        {value || "\u2014"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual timeline footer */}
            <div className="mt-8 pt-6 border-t border-purple-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] text-purple-950/30 font-bold uppercase tracking-wide">
                <span>Type: {notification.type}</span>
                <span className="text-purple-950/10">•</span>
                <span>Ref: {notification.caseId}</span>
              </div>

              <span className="text-[10px] text-purple-950/20 font-mono">
                {notification.timestamp}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTION FOOTER ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-purple-950 text-white rounded-[2.5rem] p-8 md:p-12 text-center space-y-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Ready to take action?
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
              {action
                ? "Follow the link below to view the related item and take the next step."
                : "This is a general notification. No additional action is required."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {action && (
                <Link
                  to={action.to}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20"
                >
                  {action.label}
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
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              )}
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-white/20 transition-all duration-200"
              >
                All Notifications
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotificationDetails;
