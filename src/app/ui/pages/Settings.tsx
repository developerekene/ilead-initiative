import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserPlan, selectUser } from "../../redux/slices/User";
import type { MembershipPlanId } from "../../redux/slices/User";
import ProfileSetting from "../components/settings/ProfileSettings";

/* ── Inline SVG Icons ── */

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

const AcademicIcon = () => (
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
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 14l9-5-9-5-9 5 9 5z"
      opacity="0"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ShareIcon = () => (
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
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const CreditCardIcon = () => (
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
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

const TwoFactorIcon = () => (
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
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const DownloadIcon = () => (
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
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const PaletteIcon = () => (
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
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
    />
  </svg>
);

/* ── Types ── */

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

interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  reduceMotion: boolean;
}

interface AcademicPreferences {
  cgpaTarget: string;
  studyReminders: boolean;
  consultationReminders: boolean;
}

interface iSharePreferences {
  defaultPostVisibility: "public" | "members" | "private";
  shareActivityEnabled: boolean;
  campaignNotifications: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionManagement: boolean;
}

/* ── Data ── */

const PLAN_LABELS: Record<MembershipPlanId, string> = {
  free: "Free",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

const PLAN_BADGES: Record<MembershipPlanId, string> = {
  free: "bg-purple-100 text-purple-700",
  silver: "bg-slate-100 text-slate-600",
  gold: "bg-orange-100 text-orange-700",
  platinum: "bg-purple-950 text-white",
};

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

const EXTRA_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "campaign-updates",
    label: "Campaign Progress Updates",
    description:
      "Get notified when campaigns you follow hit milestones or need support.",
    enabled: true,
  },
  {
    id: "ishare-activity",
    label: "iShare Activity",
    description:
      "Receive alerts when someone engages with your iGive or iNeed posts.",
    enabled: true,
  },
  {
    id: "itrain-completions",
    label: "iTrain Module Completions",
    description:
      "Get a notification when you complete a module or earn a certificate.",
    enabled: false,
  },
  {
    id: "mentor-assignments",
    label: "Mentor Assignments & Updates",
    description:
      "Be notified when you're matched with a mentor or when sessions are scheduled.",
    enabled: true,
  },
  {
    id: "membership-changes",
    label: "Membership & Billing",
    description:
      "Receive updates about plan changes, renewals, and payment confirmations.",
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

/* ── Component ── */

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const currentPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser);

  const [notifications, setNotifications] = useState<NotificationSetting[]>(
    NOTIFICATION_SETTINGS,
  );
  const [extraNotifications, setExtraNotifications] = useState<
    NotificationSetting[]
  >(EXTRA_NOTIFICATION_SETTINGS);
  const [privacy, setPrivacy] = useState<PrivacySetting[]>(PRIVACY_SETTINGS);
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    fontSize: "medium",
    reduceMotion: false,
  });
  const [academicPrefs, setAcademicPrefs] = useState<AcademicPreferences>({
    cgpaTarget: "3.5",
    studyReminders: true,
    consultationReminders: true,
  });
  const [isharePrefs, setISharePrefs] = useState<iSharePreferences>({
    defaultPostVisibility: "members",
    shareActivityEnabled: true,
    campaignNotifications: true,
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionManagement: true,
  });
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

  const toggleExtraNotification = (id: string) => {
    setExtraNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const handleAppearanceToggle = (key: keyof AppearanceSettings) => {
    if (key === "reduceMotion") {
      setAppearance((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
    }
  };

  const handleAcademicToggle = (key: keyof AcademicPreferences) => {
    setAcademicPrefs((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  };

  const handleIShareToggle = (key: keyof iSharePreferences) => {
    setISharePrefs((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  };

  const handleSecurityToggle = (key: keyof SecuritySettings) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] as boolean }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
        <ProfileSetting />
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
                <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-5 md:p-6 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                    Core Notifications
                  </h4>
                  {notifications.map((setting) => (
                    <div
                      key={setting.id}
                      className="py-4 flex items-center justify-between gap-6 transition-all duration-300 border-b border-purple-950/5 last:border-b-0"
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

                <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-5 md:p-6 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                    Ecosystem Notifications
                  </h4>
                  {extraNotifications.map((setting) => (
                    <div
                      key={setting.id}
                      className="py-4 flex items-center justify-between gap-6 transition-all duration-300 border-b border-purple-950/5 last:border-b-0"
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
                        onClick={() => toggleExtraNotification(setting.id)}
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

        {/* ── Membership & Billing ── */}
        <section className="bg-purple-50/30 border-t border-purple-100/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <CreditCardIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-purple-950">
                      Membership & Billing
                    </h2>
                    <p className="text-sm text-purple-950/50 font-medium">
                      Manage your subscription
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-purple-950/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-1">
                        Current Plan
                      </p>
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${PLAN_BADGES[currentPlan]}`}
                      >
                        {PLAN_LABELS[currentPlan]}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/membership")}
                      className="bg-purple-950 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                    >
                      Manage Plan
                    </button>
                  </div>
                  <div className="border-t border-purple-950/5 pt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-950/60 font-medium">
                        Member since
                      </span>
                      <span className="text-purple-950 font-bold">2025</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-950/60 font-medium">
                        Email on file
                      </span>
                      <span className="text-purple-950 font-bold">
                        {user?.email || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-950/60 font-medium">
                        Billing cycle
                      </span>
                      <span className="text-purple-950 font-bold">Monthly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Academic & iTrain Preferences ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <AcademicIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-purple-950">
                    iTrain & Academic
                  </h2>
                  <p className="text-sm text-purple-950/50 font-medium">
                    Learning and study preferences
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5">
                <div className="mb-5">
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    CGPA Target
                  </label>
                  <select
                    value={academicPrefs.cgpaTarget}
                    onChange={(e) =>
                      setAcademicPrefs((prev) => ({
                        ...prev,
                        cgpaTarget: e.target.value,
                      }))
                    }
                    className="w-full bg-purple-50/30 border border-purple-100 rounded-xl px-5 py-3.5 text-sm text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundSize: "20px",
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      paddingRight: "3rem",
                    }}
                  >
                    {["3.0", "3.2", "3.5", "3.7", "4.0"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      id: "studyReminders",
                      label: "Study Habit Reminders",
                      desc: "Receive periodic reminders to complete your study habits assessment.",
                    },
                    {
                      id: "consultationReminders",
                      label: "Consultation Reminders",
                      desc: "Get notified about upcoming academic consultation sessions.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-purple-950">
                          {item.label}
                        </h4>
                        <p className="text-xs text-purple-950/50 font-medium">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAcademicToggle(
                            item.id as keyof AcademicPreferences,
                          )
                        }
                        className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                          academicPrefs[item.id as keyof AcademicPreferences]
                            ? "bg-orange-500"
                            : "bg-purple-200"
                        }`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                            academicPrefs[item.id as keyof AcademicPreferences]
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── iShare & Campaigns Preferences ── */}
        <section className="bg-purple-50/30 border-t border-purple-100/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <ShareIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-purple-950">
                      iShare & Campaigns
                    </h2>
                    <p className="text-sm text-purple-950/50 font-medium">
                      Sharing and community preferences
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5">
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-purple-950 mb-2">
                      Default Post Visibility
                    </label>
                    <select
                      value={isharePrefs.defaultPostVisibility}
                      onChange={(e) =>
                        setISharePrefs((prev) => ({
                          ...prev,
                          defaultPostVisibility: e.target.value as
                            | "public"
                            | "members"
                            | "private",
                        }))
                      }
                      className="w-full bg-purple-50/30 border border-purple-100 rounded-xl px-5 py-3.5 text-sm text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200 appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundSize: "20px",
                        backgroundPosition: "right 1rem center",
                        backgroundRepeat: "no-repeat",
                        paddingRight: "3rem",
                      }}
                    >
                      <option value="public">Public — Anyone can see</option>
                      <option value="members">
                        Members — Only ecosystem members
                      </option>
                      <option value="private">Private — Only me</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        id: "shareActivityEnabled",
                        label: "Share Activity Status",
                        desc: "Let the community see when you're active on iShare.",
                      },
                      {
                        id: "campaignNotifications",
                        label: "Campaign Engagement Alerts",
                        desc: "Get notified when campaigns you follow need support.",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-purple-950">
                            {item.label}
                          </h4>
                          <p className="text-xs text-purple-950/50 font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleIShareToggle(
                              item.id as keyof iSharePreferences,
                            )
                          }
                          className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                            isharePrefs[item.id as keyof iSharePreferences]
                              ? "bg-orange-500"
                              : "bg-purple-200"
                          }`}
                          aria-label={`Toggle ${item.label}`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              isharePrefs[item.id as keyof iSharePreferences]
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Appearance ── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <PaletteIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-purple-950">
                    Appearance
                  </h2>
                  <p className="text-sm text-purple-950/50 font-medium">
                    Customize your visual experience
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5">
                <div className="mb-5">
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    Theme
                  </label>
                  <div className="flex gap-3">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setAppearance((prev) => ({ ...prev, theme: t }))
                        }
                        className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-200 cursor-pointer ${
                          appearance.theme === t
                            ? "bg-purple-950 text-white shadow-md"
                            : "bg-purple-50/50 text-purple-950/60 hover:bg-purple-100/50 border border-purple-100"
                        }`}
                      >
                        {t === "light"
                          ? "☀️ Light"
                          : t === "dark"
                            ? "🌙 Dark"
                            : "💻 System"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-bold text-purple-950 mb-2">
                    Font Size
                  </label>
                  <div className="flex gap-3">
                    {(["small", "medium", "large"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setAppearance((prev) => ({ ...prev, fontSize: s }))
                        }
                        className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-200 cursor-pointer ${
                          appearance.fontSize === s
                            ? "bg-purple-950 text-white shadow-md"
                            : "bg-purple-50/50 text-purple-950/60 hover:bg-purple-100/50 border border-purple-100"
                        }`}
                      >
                        {s === "small" ? "A" : s === "medium" ? "A" : "A"}
                        <span className="ml-1 opacity-60">
                          {s === "small"
                            ? "Small"
                            : s === "medium"
                              ? "Medium"
                              : "Large"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-purple-950">
                      Reduced Motion
                    </h4>
                    <p className="text-xs text-purple-950/50 font-medium">
                      Minimize animations and transitions for improved
                      accessibility.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAppearanceToggle("reduceMotion")}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                      appearance.reduceMotion
                        ? "bg-orange-500"
                        : "bg-purple-200"
                    }`}
                    aria-label="Toggle reduced motion"
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        appearance.reduceMotion
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Account Security ── */}
        <section className="bg-purple-50/30 border-t border-purple-100/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <TwoFactorIcon />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-purple-950">
                      Account Security
                    </h2>
                    <p className="text-sm text-purple-950/50 font-medium">
                      Protect your account and data
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <TwoFactorIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-purple-950">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-xs text-purple-950/50 font-medium">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSecurityToggle("twoFactorEnabled")}
                      className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                        security.twoFactorEnabled
                          ? "bg-orange-500"
                          : "bg-purple-200"
                      }`}
                      aria-label="Toggle two-factor authentication"
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          security.twoFactorEnabled
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-purple-950/5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <GlobeIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-purple-950">
                          Active Sessions
                        </h4>
                        <p className="text-xs text-purple-950/50 font-medium">
                          Manage devices where you're logged in.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSecurityToggle("sessionManagement")}
                      className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ${
                        security.sessionManagement
                          ? "bg-orange-500"
                          : "bg-purple-200"
                      }`}
                      aria-label="Toggle session management"
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          security.sessionManagement
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold px-5 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                    >
                      <DownloadIcon />
                      Download My Data
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Account
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
