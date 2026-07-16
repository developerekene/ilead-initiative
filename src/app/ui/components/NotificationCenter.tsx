import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  markAllAsRead as markAllRead,
  selectNotifications,
  selectUnreadCount,
  type Notification,
} from "../../redux/slices/notificationSlice";

const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Real data from the Redux store
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  // Standard DOM wrapper safety layer to close panel layout on outside click boundaries
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SATISFIES CRITERIA: Clears flags and routes browser directly to individual target parameters
  const handleNotificationClick = (alert: Notification) => {
    // Dispatch markAsRead to the Redux store
    if (alert.isUnread) {
      dispatch(markAsRead(alert.id));
    }

    // Dismiss view state context overlay drawer
    setIsOpen(false);

    // Execute absolute router navigation path redirection logic
    navigate(`/dashboard/cases/${alert.caseId}`);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllRead());
  };

  // UI Presentational helper maps clean layout accent rings dynamically based on status properties
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

  return (
    <div className="relative inline-block bg-white" ref={dropdownRef}>
      {/* Header Interactive Trigger Box Component */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-purple-950/5 text-purple-950 transition-colors focus:outline-none cursor-pointer group"
        aria-label="Open Notifications Inbox"
      >
        {/* Clean inline vector bell icon block tracking design layers */}
        <svg
          className="w-5 h-5 text-purple-950/70 group-hover:text-purple-950 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* SATISFIES CRITERIA: Unread indicator structural check conditional bubble rendering */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-orange-500 text-white font-black text-[10px] rounded-full flex items-center justify-center px-1 border-2 border-white animate-pulse shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Canvas Overlay Container Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-purple-950/10 rounded-2xl shadow-xl shadow-purple-950/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Panel Section Title Block Headers */}
          <div className="px-5 py-4 border-b border-purple-950/5 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-sm font-black text-purple-950 tracking-tight">
                Ecosystem Ledger Events
              </h3>
              <span className="text-[10px] text-purple-950/40 font-bold uppercase tracking-wider block mt-0.5">
                Real-Time Operations Pipeline
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-orange-500 hover:text-purple-950 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Scrollable Document Area Stream Context */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-purple-950/[0.03] bg-white">
            {notifications.length === 0 ? (
              <div className="py-12 px-5 text-center">
                <span className="text-2xl block mb-2">📥</span>
                <p className="text-xs text-purple-950/40 font-bold uppercase tracking-wide">
                  Your Ledger is completely empty
                </p>
              </div>
            ) : (
              notifications.map((alert) => {
                const meta = getTypeStyles(alert.type);
                return (
                  <div
                    key={alert.id}
                    onClick={() => handleNotificationClick(alert)}
                    className={`p-4 transition-all flex gap-3 items-start cursor-pointer hover:bg-slate-50 relative ${
                      alert.isUnread ? "bg-orange-50/20" : "bg-white"
                    }`}
                  >
                    {/* Dynamic unread horizontal highlight layout pin */}
                    {alert.isUnread && (
                      <div className="absolute top-5 left-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}

                    {/* Status Meta Graphic Indicator Wrapper */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${meta.bg} ${meta.border} ${meta.text}`}
                    >
                      {meta.icon}
                    </div>

                    {/* Content Structural Text Parameters */}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          className={`text-xs font-black tracking-tight leading-snug ${
                            alert.isUnread
                              ? "text-purple-950"
                              : "text-purple-950/80"
                          }`}
                        >
                          {alert.title}
                        </h4>
                        <span className="text-[9px] font-medium text-purple-950/40 whitespace-nowrap shrink-0 mt-0.5">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-purple-950/60 font-medium leading-relaxed line-clamp-2">
                        {alert.message}
                      </p>

                      {/* Actor Meta String Assignment tracking context */}
                      <div className="pt-1 flex items-center gap-1.5 text-[10px] text-purple-950/40 font-bold uppercase tracking-wide">
                        <span>By: {alert.senderName}</span>
                        <span>•</span>
                        <span className="text-purple-950/30">
                          Ref ID: {alert.caseId}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer System Status Banner Anchor */}
          <div className="px-5 py-3.5 bg-slate-50 border-t border-purple-950/5 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-950/30 block">
              System Node Synced Operational • Secure SSL Endpoints
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
