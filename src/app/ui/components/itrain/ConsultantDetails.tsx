import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectConsultantById,
  selectConsultantsLoading,
  selectConsultantsError,
} from "../../../redux/slices/consultantSlice";
import { authService } from "../../../redux/configuration/services/auth.service";

const ConsultantDetails: React.FC = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  const consultant = useSelector(selectConsultantById(consultantId ?? ""));
  const loading = useSelector(selectConsultantsLoading);
  const fetchError = useSelector(selectConsultantsError);

  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!consultant) {
      authService.fetchConsultants().finally(() => setHasAttemptedFetch(true));
    } else {
      setHasAttemptedFetch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryFetch = () => {
    setHasAttemptedFetch(false);
    authService.fetchConsultants().finally(() => setHasAttemptedFetch(true));
  };

  if (!consultant) {
    if (loading || !hasAttemptedFetch) {
      return (
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center text-purple-950/40 font-medium">
          Loading consultant...
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
          <h1 className="text-2xl font-black text-purple-950 mb-2">
            Couldn't load this profile
          </h1>
          <p className="text-sm text-purple-950/50 font-medium mb-8">
            {fetchError}
          </p>
          <button
            onClick={retryFetch}
            className="bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
        <h1 className="text-2xl font-black text-purple-950 mb-2">
          Consultant not found
        </h1>
        <p className="text-sm text-purple-950/50 font-medium mb-8">
          This profile doesn't exist or has been removed.
        </p>
        <Link
          to="/iTrain/consultants"
          className="bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all"
        >
          ← Back to Directory
        </Link>
      </div>
    );
  }

  const socials = [
    {
      key: "linkedin",
      label: "LinkedIn",
      url: consultant.socialLinks?.linkedin,
    },
    {
      key: "twitter",
      label: "X / Twitter",
      url: consultant.socialLinks?.twitter,
    },
    {
      key: "instagram",
      label: "Instagram",
      url: consultant.socialLinks?.instagram,
    },
    {
      key: "website",
      label: "Website",
      url: consultant.socialLinks?.website,
    },
  ].filter((s) => !!s.url);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <Link
          to="/iTrain/consultants"
          className="flex items-center gap-1.5 text-purple-950/50 hover:text-purple-950 font-bold text-sm transition-colors mb-8 w-fit"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column: profile */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src={
                    consultant.avatar ||
                    "https://api.dicebear.com/7.x/initials/svg?seed=" +
                      encodeURIComponent(consultant.name)
                  }
                  alt={consultant.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-purple-950/5"
                />
                {consultant.isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1 border-2 border-white flex items-center justify-center shadow-sm"
                    title="Verified iTrain Professional"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                  {consultant.name}
                </h1>
                <p className="text-sm font-bold text-orange-500 mt-1">
                  {consultant.role}
                </p>
                <p className="text-sm text-purple-950/60 font-medium">
                  {consultant.institution}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {consultant.expertise.map((exp) => (
                <span
                  key={exp}
                  className="text-[10px] font-black tracking-wider uppercase bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100"
                >
                  {exp}
                </span>
              ))}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
                What You Do
              </p>
              <p className="text-base text-purple-950/80 font-medium leading-relaxed">
                {consultant.bio}
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-xs font-bold text-purple-950/40 uppercase tracking-wider block">
                  Experience
                </span>
                <span className="font-black text-purple-950">
                  {consultant.yearsOfExperience}{" "}
                  {consultant.yearsOfExperience === 1 ? "year" : "years"}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-purple-950/40 uppercase tracking-wider block">
                  Impact
                </span>
                <span className="font-black text-purple-950">
                  {consultant.impactHours} hrs gifted
                </span>
              </div>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
                  Connect
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={
                        s.url!.startsWith("http") ? s.url! : `https://${s.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-purple-950/70 bg-slate-50 border border-purple-950/10 px-3 py-2 rounded-lg hover:border-orange-500/40 hover:text-purple-950 transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-purple-950/8 rounded-[2rem] p-6 shadow-xl shadow-purple-950/5">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                Book a Session
              </p>
              {consultant.calendlyLink ? (
                <>
                  <div className="rounded-2xl overflow-hidden border border-purple-950/5">
                    <iframe
                      src={
                        consultant.calendlyLink.startsWith("http")
                          ? consultant.calendlyLink
                          : `https://${consultant.calendlyLink}`
                      }
                      title={`Book a session with ${consultant.name}`}
                      width="100%"
                      height="480"
                      frameBorder="0"
                    />
                  </div>
                  <a
                    href={
                      consultant.calendlyLink.startsWith("http")
                        ? consultant.calendlyLink
                        : `https://${consultant.calendlyLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-3 text-xs font-bold text-purple-950/40 hover:text-purple-950 transition-colors"
                  >
                    Open booking page in a new tab ↗
                  </a>
                </>
              ) : (
                <div className="bg-slate-50 border border-dashed border-purple-950/10 rounded-2xl p-6 text-center">
                  <p className="text-sm text-purple-950/40 font-medium">
                    This consultant hasn't added a booking link yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDetails;
