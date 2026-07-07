import React, { useState } from "react";

/* ── Types ── */

interface ProfileForm {
  fullName: string;
  email: string;
  bio: string;
  timezone: string;
  role: string;
}

interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
}

interface ExtendedProfile {
  photo: string;
  location: string;
  pronouns: string;
  phone: string;
  availability: string[];
  contactMethod: string;
  socialLinks: SocialLinks;
}

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

const CameraIcon = () => (
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
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

/* ── Data ── */

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

const inputClass =
  "w-full bg-purple-50/30 border border-purple-100 rounded-xl px-5 py-3.5 text-sm text-purple-950 placeholder-purple-950/30 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200";

/* ── Component ── */

const ProfileSetting: React.FC = () => {
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "Ekene Okonkwo",
    email: "ekene@ileadinitiative.com",
    bio: "Software engineer passionate about bridging the opportunity gap through cross-disciplinary mentorship and community-driven digital literacy.",
    timezone: "Africa/Lagos (WAT)",
    role: "Individual Member",
  });

  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile>({
    photo: "",
    location: "",
    pronouns: "",
    phone: "",
    availability: ["Weekday evenings"],
    contactMethod: "Via iLEAD platform messages",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  });

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtendedProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1] as keyof SocialLinks;
      setExtendedProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value },
      }));
    } else {
      setExtendedProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityToggle = (slot: string) => {
    setExtendedProfile((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((s) => s !== slot)
        : [...prev.availability, slot],
    }));
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        {/* Section Label */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <UserIcon />
            </div>
            <div>
              <h2 className="text-2xl font-black text-purple-950">Profile</h2>
              <p className="text-sm text-purple-950/50 font-medium">
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-purple-950/5">
            {/* Photo / Avatar */}
            <div className="mb-6 pb-6 border-b border-purple-950/5">
              <label className="block text-sm font-bold text-purple-950 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-5">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-orange-200 flex items-center justify-center text-purple-950 text-xl font-black border-2 border-purple-950/10 overflow-hidden flex-shrink-0"
                  style={
                    extendedProfile.photo
                      ? {
                          backgroundImage: `url(${extendedProfile.photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {!extendedProfile.photo && profile.fullName.charAt(0)}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                  >
                    <CameraIcon />
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    className="bg-purple-50 hover:bg-red-50 text-red-500 font-bold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-purple-950 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={extendedProfile.phone}
                  onChange={handleExtendedProfileChange}
                  placeholder="+234 800 000 0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-950 mb-2">
                  Pronouns
                </label>
                <input
                  type="text"
                  name="pronouns"
                  value={extendedProfile.pronouns}
                  onChange={handleExtendedProfileChange}
                  placeholder="e.g. they/them, he/him, she/her"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-purple-950 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={extendedProfile.location}
                  onChange={handleExtendedProfileChange}
                  placeholder="City, Country"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-950 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={profile.role}
                  onChange={handleProfileChange}
                  className={`${inputClass} appearance-none pr-12`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundSize: "20px",
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <option>Individual Member</option>
                  <option>Contributor (Mentor)</option>
                  <option>Business Founder</option>
                  <option>Community Organizer</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-purple-950 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleProfileChange}
                className={`${inputClass} appearance-none pr-12`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundSize: "20px",
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-purple-950 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={handleProfileChange}
                placeholder="Tell the community about yourself..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-purple-950/5">
              <h4 className="text-sm font-bold text-purple-950 mb-3">
                Social Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-950/60 mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="social.linkedin"
                    value={extendedProfile.socialLinks.linkedin}
                    onChange={handleExtendedProfileChange}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950/60 mb-1.5">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="social.github"
                    value={extendedProfile.socialLinks.github}
                    onChange={handleExtendedProfileChange}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950/60 mb-1.5">
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    name="social.twitter"
                    value={extendedProfile.socialLinks.twitter}
                    onChange={handleExtendedProfileChange}
                    placeholder="https://twitter.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Availability & Contact */}
            <div className="mt-6 pt-6 border-t border-purple-950/5">
              <h4 className="text-sm font-bold text-purple-950 mb-3">
                Availability & Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-purple-950/60 mb-1.5">
                    Preferred Contact Method
                  </label>
                  <select
                    name="contactMethod"
                    value={extendedProfile.contactMethod}
                    onChange={handleExtendedProfileChange}
                    className={`${inputClass} appearance-none pr-12`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a3f6b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundSize: "20px",
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option>Via iLEAD platform messages</option>
                    <option>Email</option>
                    <option>Phone / WhatsApp</option>
                    <option>Any method</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-950/60 mb-2">
                  Availability Slots
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Weekday mornings",
                    "Weekday evenings",
                    "Saturday",
                    "Sunday",
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleAvailabilityToggle(slot)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-150 cursor-pointer ${
                        extendedProfile.availability.includes(slot)
                          ? "bg-purple-950 text-white border-purple-950"
                          : "bg-purple-50 text-purple-950/50 border-purple-950/10 hover:border-orange-500 hover:text-orange-500"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSetting;
