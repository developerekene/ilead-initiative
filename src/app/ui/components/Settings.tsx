import React, { useState } from "react";

/* ── Inline SVG Icons ── */

const UserIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

const KeyIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

/* ── Types ── */

interface ProfileForm {
  fullName: string;
  email: string;
  bio: string;
  timezone: string;
  role: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/* ── Data ── */

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "mentorship-reminders",
    label: "Mentorship Session Reminders",
    description:
      "Get notified 24 hours before your scheduled mentorship sessions.",
    enabled: true,
  },
  {
    id: "community-updates",
    label: "Community Updates",
    description:
      "Receive updates about new workshops, resources, and ecosystem announcements.",
    enabled: true,
  },
  {
    id: "message-notifications",
    label: "Direct Messages",
    description: "Get notified when another member sends you a direct message.",
    enabled: false,
  },
  {
    id: "weekly-digest",
    label: "Weekly Digest",
    description:
      "Receive a weekly summary of ecosystem activity and highlights.",
    enabled: true,
  },
];

const PRIVACY_SETTINGS: PrivacySetting[] = [
  {
    id: "profile-visibility",
    label: "Public Profile",
    description:
      "Allow other ecosystem members to view your profile and see your mentorship track.",
    enabled: true,
  },
  {
    id: "activity-status",
    label: "Show Activity Status",
    description:
      "Let others see when you're active and available for mentorship or collaboration.",
    enabled: true,
  },
  {
    id: "share-progress",
    label: "Share Learning Progress",
    description:
      "Allow the community to see aggregated milestone data to inspire collective growth.",
    enabled: false,
  },
];

const TIMEZONE_OPTIONS = [
  "UTC (Coordinated Universal Time)",
  "America/New_York (EST)",
  "America/Chicago (CST)",
  "America/Denver (MST)",
  "America/Los_Angeles (PST)",
  "Africa/Lagos (WAT)",
  "Africa/Nairobi (EAT)",
  "Africa/Cairo (CAT)",
  "Europe/London (GMT)",
  "Europe/Paris (CET)",
  "Asia/Dubai (GST)",
  "Asia/Kolkata (IST)",
  "Asia/Singapore (SGT)",
  "Asia/Tokyo (JST)",
  "Australia/Sydney (AEDT)",
];

/* ── Component ── */

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "Ekene Okonkwo",
    email: "ekene@ileadinitiative.com",
    bio: "Software engineer passionate about bridging the opportunity gap through cross-disciplinary mentorship and community-driven digital literacy.",
    timezone: "Africa/Lagos (WAT)",
    role: "Individual Member",
  });

  const [notifications, setNotifications] = useState<NotificationSetting[]>(
    NOTIFICATION_SETTINGS,
  );
  const [privacy, setPrivacy] = useState<PrivacySetting[]>(PRIVACY_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    "w-full bg-purple-50/30 border border-purple-100 rounded-xl px-5 py-3.5 text-sm text-purple-950 placeholder-purple-950/30 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200";

  return (
    <main className="w-full bg-white pt-16">
      {/* ── Hero Header ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 md:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 mb-6 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Manage Your Preferences
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-purple-950 mb-4">
            Account <span className="text-orange-500">Settings</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
            Customize your profile, manage notifications, and control your
            privacy preferences across the iLEAD ecosystem.
          </p>
        </div>
      </section>

      <form onSubmit={handleSave}>
        {/* ── Profile Information ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Section Label */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <UserIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-purple-950">
                    Profile
                  </h2>
                  <p className="text-sm text-purple-950/50 font-medium">
                    Update your personal information
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-purple-950/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-purple-950 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-950 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                    className={`${inputClass} appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    }}
                  >
                    <option>Individual Member</option>
                    <option>Contributor (Mentor)</option>
                    <option>Business Founder</option>
                    <option>Community Organizer</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={profile.timezone}
                    onChange={handleProfileChange}
                    className={`${inputClass} appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    }}
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell the community about yourself..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Notification Preferences ── */}
        <section className="bg-purple-50/30 border-t border-purple-100/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              {/* Section Label */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <BellIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-purple-950">
                      Notifications
                    </h2>
                    <p className="text-sm text-purple-950/50 font-medium">
                      Choose what updates you receive
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="lg:col-span-3 space-y-4">
                {notifications.map((setting) => (
                  <div
                    key={setting.id}
                    className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 flex items-center justify-between gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm md:text-base font-bold text-purple-950 mb-1">
                        {setting.label}
                      </h4>
                      <p className="text-xs md:text-sm text-purple-950/50 font-medium leading-relaxed">
                        {setting.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification(setting.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                        setting.enabled ? "bg-orange-500" : "bg-purple-200"
                      }`}
                      aria-label={`Toggle ${setting.label}`}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          setting.enabled ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Privacy & Security ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Section Label */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <ShieldIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-purple-950">
                    Privacy & Security
                  </h2>
                  <p className="text-sm text-purple-950/50 font-medium">
                    Control your visibility and data
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Toggles + Password */}
            <div className="lg:col-span-3 space-y-6">
              {privacy.map((setting) => (
                <div
                  key={setting.id}
                  className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 flex items-center justify-between gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-bold text-purple-950 mb-1">
                      {setting.label}
                    </h4>
                    <p className="text-xs md:text-sm text-purple-950/50 font-medium leading-relaxed">
                      {setting.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePrivacy(setting.id)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                      setting.enabled ? "bg-orange-500" : "bg-purple-200"
                    }`}
                    aria-label={`Toggle ${setting.label}`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        setting.enabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}

              {/* Password Change Card */}
              <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <KeyIcon />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm md:text-base font-bold text-purple-950 mb-1">
                      Password
                    </h4>
                    <p className="text-xs md:text-sm text-purple-950/50 font-medium leading-relaxed mb-4">
                      It's a good idea to use a strong password that you don't
                      use elsewhere.
                    </p>
                    <button
                      type="button"
                      className="bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Save Button ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="bg-purple-950 rounded-[2.5rem] px-8 py-12 md:py-14 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-950/20">
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-purple-900/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <GlobeIcon />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                  Ready to save your changes?
                </h2>
                <p className="text-sm sm:text-base text-purple-100/80 font-medium max-w-lg mx-auto leading-relaxed mb-8">
                  Your preferences will be applied immediately across the iLEAD
                  ecosystem. You can always come back and update them anytime.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-orange-500 hover:bg-white hover:text-purple-950 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 cursor-pointer text-base"
                >
                  {saved ? (
                    <>
                      <CheckIcon />
                      Changes Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
};

export default Settings;
