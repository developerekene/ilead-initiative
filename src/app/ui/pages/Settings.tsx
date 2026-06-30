import React, { useState } from "react";

const Settings: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: "Ekenedilichukwu Okoli",
    email: "ekene@ileadinitiative.org",
    bio: "Founder & Lead Technical Associate at iLEAD. Building resilient talent infrastructure across Africa.",
    phone: "+234 800 123 4567",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    mentorshipAlerts: true,
    communityDigest: false,
    equipmentFundNews: true,
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
    if (saved) setSaved(false);
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    if (saved) setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* SECTION 1: HERO STRATEGIC HEADER */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              System Configuration
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Account <span className="text-orange-500">Settings</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
              Manage your profile, notification preferences, and account
              parameters — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: SETTINGS FORM */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
        >
          {/* LEFT COLUMN — Profile & Account */}
          <div className="lg:col-span-7 space-y-10">
            {/* Success banner */}
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-emerald-800">
                    Settings saved successfully!
                  </p>
                  <p className="text-xs font-semibold text-emerald-700/70">
                    Your changes have been applied to your account.
                  </p>
                </div>
              </div>
            )}

            {/* PROFILE INFORMATION */}
            <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-purple-950">
                  Profile Information
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-semibold leading-relaxed">
                  Update your personal details visible to the iLEAD community.
                </p>
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="bio"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200 resize-y"
                  />
                </div>
              </div>
            </div>

            {/* ACCOUNT SECURITY */}
            <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-purple-950">
                  Account Security
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-semibold leading-relaxed">
                  Manage your password and account access credentials.
                </p>
              </div>

              <div className="space-y-5">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="currentPassword"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="newPassword"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter a new password"
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter the new password"
                    className="w-full bg-white border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all duration-200"
                  />
                </div>

                {/* Update Password Button */}
                <button
                  type="button"
                  className="text-xs font-black text-orange-500 uppercase tracking-wider bg-orange-50 border border-orange-100 hover:bg-orange-100 px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-red-50/30 border border-red-200/50 rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-200/20 rounded-bl-full pointer-events-none" />
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-red-700">
                  Danger Zone
                </h3>
                <p className="text-xs sm:text-sm text-red-600/60 font-semibold leading-relaxed">
                  Irreversible actions that permanently affect your account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 border border-red-200/40 rounded-xl p-4 sm:p-5">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-purple-950">
                    Delete your account
                  </p>
                  <p className="text-xs font-semibold text-purple-950/60">
                    Permanently remove your profile, data, and access from the
                    iLEAD ecosystem.
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 bg-white hover:bg-red-600 border-2 border-red-300 hover:border-red-600 text-red-600 hover:text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-orange-500 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20 cursor-pointer text-base"
            >
              Save Changes
            </button>
          </div>

          {/* RIGHT COLUMN — Notifications */}
          <div className="lg:col-span-5 space-y-8">
            {/* NOTIFICATION PREFERENCES */}
            <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-purple-950">
                  Notification Preferences
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-semibold leading-relaxed">
                  Control which updates you receive from the iLEAD ecosystem.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "emailUpdates" as const,
                    label: "Email Updates",
                    desc: "Receive newsletters and platform announcements via email.",
                  },
                  {
                    key: "mentorshipAlerts" as const,
                    label: "Mentorship Alerts",
                    desc: "Get notified about new mentorship matches, session reminders, and cohort updates.",
                  },
                  {
                    key: "communityDigest" as const,
                    label: "Community Digest",
                    desc: "Weekly summary of top discussions, stories, and community highlights.",
                  },
                  {
                    key: "equipmentFundNews" as const,
                    label: "Equipment Fund News",
                    desc: "Updates on equipment fund availability, application windows, and approval statuses.",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4 bg-white border border-purple-950/5 rounded-xl p-4 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-black text-purple-950">
                        {label}
                      </p>
                      <p className="text-xs font-semibold text-purple-950/60 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(key)}
                      className={`shrink-0 w-11 h-6 rounded-full transition-all duration-200 relative cursor-pointer ${
                        notifications[key]
                          ? "bg-orange-500"
                          : "bg-purple-950/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          notifications[key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SESSION INFO CARD */}
            <div className="bg-purple-950 text-white rounded-[2rem] p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-xl shadow-purple-950/10">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-900/40 blur-3xl pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Session & Privacy
                </span>
                <h4 className="text-lg font-black tracking-tight">
                  Active Sessions
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
                  You are currently signed in on one active device. Manage your
                  login sessions and review connected applications.
                </p>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-orange-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white/80">
                      Windows Desktop — Chrome
                    </p>
                    <p className="text-[10px] font-semibold text-white/40">
                      Active now • Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Sign Out All Devices
                </button>
              </div>

              <div className="pt-3 border-t border-white/10 relative z-10">
                <a
                  href="/privacy-policy"
                  className="text-[11px] font-bold text-white/50 hover:text-orange-400 transition-colors duration-200"
                >
                  → Review Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Settings;
