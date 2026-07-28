import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectIsLoggedIn,
  selectUserPlan,
  type SerializedUser,
} from "../../redux/slices/User";

/* ─── Plan badge helper ────────────────────────────── */

const PLAN_META: Record<string, { label: string; color: string }> = {
  free: {
    label: "Free",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  silver: {
    label: "Silver",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
  gold: { label: "Gold", color: "bg-amber-50 text-amber-700 border-amber-200" },
  platinum: {
    label: "Platinum",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

/* ─── Initials avatar generator ────────────────────── */

const getInitials = (user: SerializedUser): string => {
  if (user.displayName) {
    const parts = user.displayName.split(" ");
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() ||
    "?"
  );
};

/* ─── Component ────────────────────────────────────── */

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentPlan = useSelector(selectUserPlan);

  /* ── Redirect if not logged in ─────────────────── */
  if (!isLoggedIn) {
    navigate("/sign-in");
    return null;
  }

  const initials = getInitials(user);
  const planMeta = PLAN_META[currentPlan] ?? PLAN_META.free;

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              My Profile
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Welcome back,{" "}
              <span className="text-orange-500">
                {user.firstName || "there"}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-3xl">
              Your iLEAD ecosystem profile — view your details, track your
              membership, and manage your presence in the community.
            </p>
          </div>
          <div className="lg:col-span-4 lg:pt-14 flex justify-center lg:justify-end">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-950 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-lg border-4 border-white ring-2 ring-purple-950/10 mx-auto">
                {initials}
              </div>
              <div
                className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${planMeta.color}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {planMeta.label} Plan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROFILE CONTENT ─── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* ── LEFT: Main info ── */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-6">
              <div>
                <h2 className="text-xl font-black tracking-tight text-purple-950">
                  {user.displayName || `${user.firstName} ${user.lastName}`}
                </h2>
                <p className="text-sm text-purple-950/60 font-medium mt-1">
                  {user.email}
                </p>
              </div>
              {user.bio && (
                <div className="pt-4 border-t border-purple-950/5">
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block mb-2">
                    Bio
                  </span>
                  <p className="text-sm text-purple-950/70 font-medium leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-4 border-t border-purple-950/5">
                {user.location && (
                  <div>
                    <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-purple-950 mt-0.5 block">
                      {user.location}
                    </span>
                  </div>
                )}
                {user.pronouns && (
                  <div>
                    <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                      Pronouns
                    </span>
                    <span className="text-sm font-semibold text-purple-950 mt-0.5 block">
                      {user.pronouns}
                    </span>
                  </div>
                )}
                {user.availability && (
                  <div>
                    <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                      Availability
                    </span>
                    <span className="text-sm font-semibold text-purple-950 mt-0.5 block">
                      {user.availability}
                    </span>
                  </div>
                )}
                {user.contactMethod && (
                  <div>
                    <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                      Contact Method
                    </span>
                    <span className="text-sm font-semibold text-purple-950 mt-0.5 block">
                      {user.contactMethod}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50/60 border border-purple-950/[0.03] rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                Account Summary
              </h3>
              <div className="h-px bg-purple-950/5" />
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Email
                  </span>
                  <span className="text-sm font-bold text-purple-950 mt-0.5 block break-all">
                    {user.email}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Membership
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mt-0.5 ${planMeta.color}`}
                  >
                    {planMeta.label}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                    Profile Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mt-0.5 ${user.profileComplete ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${user.profileComplete ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    {user.profileComplete ? "Complete" : "Incomplete"}
                  </span>
                </div>
                {user.profileComplete && user.updatedAt && (
                  <div>
                    <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                      Last Updated
                    </span>
                    <span className="text-xs font-bold text-purple-950/60 mt-0.5 block">
                      {new Date(user.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="w-full bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
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
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Account Settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
