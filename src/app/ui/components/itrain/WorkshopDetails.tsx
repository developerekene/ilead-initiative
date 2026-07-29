import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/slices/User";
import toast from "react-hot-toast";
import { workshops } from "../../../utils/data";
import { WorkshopTypes } from "../../../utils/types";

const STATUS_STYLES: Record<string, string> = {
  Open: "text-green-600 bg-green-50 border-green-200",
  "Almost Full": "text-orange-500 bg-orange-50 border-orange-200",
  Closed: "text-slate-500 bg-slate-50 border-slate-200",
  Completed: "text-purple-600 bg-purple-50 border-purple-200",
  "Coming Soon": "text-blue-600 bg-blue-50 border-blue-200",
};

const MODE_STYLES: Record<string, string> = {
  Online: "text-blue-600 bg-blue-50 border-blue-100",
  Physical: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Hybrid: "text-purple-600 bg-purple-50 border-purple-100",
};

const LEVEL_STYLES: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50 border-green-100",
  Intermediate: "text-orange-600 bg-orange-50 border-orange-100",
  Advanced: "text-red-600 bg-red-50 border-red-100",
};

const SeatsBar: React.FC<{ workshop: WorkshopTypes }> = ({ workshop }) => {
  const pct = Math.min((workshop.enrolled / workshop.seats) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-purple-950/50 mb-2">
        <span>{workshop.enrolled} registered</span>
        <span>{workshop.seats - workshop.enrolled} seats remaining</span>
      </div>
      <div className="h-2 bg-purple-950/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 90 ? "bg-orange-500" : "bg-purple-700"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const WorkshopDetails: React.FC = () => {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const workshop = workshops.find((w) => w.id === workshopId);

  if (!workshop) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-purple-950/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-purple-950 mb-2">
          Workshop not found
        </h1>
        <p className="text-sm text-purple-950/50 font-medium mb-8">
          This workshop doesn't exist or has been removed.
        </p>
        <Link
          to="/iTrain/workshops"
          className="bg-orange-500 hover:bg-purple-950 text-white font-black px-6 py-3 rounded-xl text-sm tracking-wide transition-all"
        >
          ← Back to Workshops
        </Link>
      </div>
    );
  }

  const canRegister =
    workshop.status !== "Closed" && workshop.status !== "Completed";

  const handleRegister = () => {
    if (!isLoggedIn) {
      toast.error("Sign in to register for this workshop.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", {
        state: { from: `/iTrain/workshops/${workshop.id}` },
      });
      return;
    }
    toast.success("You're registered! Check your email for details.", {
      style: { background: "#1e1b4b", color: "#fff" },
    });
  };

  // Related workshops (same category, excluding current)
  const related = workshops
    .filter((w) => w.category === workshop.category && w.id !== workshop.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero image ── */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-950/30 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-6 md:left-12">
          <Link
            to="/iTrain/workshops"
            className="flex items-center gap-1.5 text-white/80 hover:text-white font-bold text-sm transition-colors"
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
            All Workshops
          </Link>
        </div>

        {/* Overlay badges */}
        <div className="absolute top-6 right-6 md:right-12 flex gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${MODE_STYLES[workshop.mode]}`}
          >
            {workshop.mode}
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${LEVEL_STYLES[workshop.level]}`}
          >
            {workshop.level}
          </span>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <span className="text-xs font-bold text-orange-400 tracking-wider uppercase mb-2 block">
            {workshop.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight max-w-3xl">
            {workshop.title}
          </h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Left column: content ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Status + tags row */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1 ${STATUS_STYLES[workshop.status]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {workshop.status}
              </span>
              {workshop.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-purple-950/40 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-3">
                About this workshop
              </p>
              <p className="text-base text-purple-950/80 font-medium leading-relaxed">
                {workshop.description}
              </p>
            </div>

            {/* What you'll learn */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                What you'll learn
              </p>
              <ul className="space-y-3">
                {workshop.tags.map((tag, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-purple-950/80">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilitator */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                Your Facilitator
              </p>
              <div className="flex items-start gap-4 bg-slate-50 border border-purple-950/5 rounded-2xl p-5">
                <div className="w-14 h-14 rounded-full bg-purple-700 text-white flex items-center justify-center text-lg font-black shrink-0">
                  {workshop.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-base font-black text-purple-950">
                    {workshop.instructor}
                  </p>
                  <p className="text-xs font-bold text-orange-500 mb-2">
                    {workshop.instructorRole}
                  </p>
                  <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
                    Expert facilitator with deep experience in{" "}
                    {workshop.category.toLowerCase()} for students and
                    professionals.
                  </p>
                </div>
              </div>
            </div>

            {/* Related workshops */}
            {related.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-purple-950/40 mb-4">
                  More in {workshop.category}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((w) => (
                    <Link
                      key={w.id}
                      to={`/iTrain/workshops/${w.id}`}
                      className="flex items-start gap-3 bg-slate-50 border border-purple-950/5 rounded-2xl p-4 hover:border-orange-500/20 hover:shadow-md transition-all group"
                    >
                      <img
                        src={w.image}
                        alt={w.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-purple-950 group-hover:text-purple-700 line-clamp-2 leading-snug">
                          {w.title}
                        </p>
                        <p className="text-[11px] text-purple-950/40 font-medium mt-1">
                          {w.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column: registration card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-purple-950/8 rounded-[2rem] p-7 shadow-xl shadow-purple-950/5 space-y-5">
              {/* Price */}
              <div className="text-center pb-5 border-b border-purple-950/5">
                <p className="text-3xl font-black text-purple-950">
                  {workshop.price}
                </p>
                <p className="text-xs text-purple-950/40 font-medium mt-1">
                  per participant
                </p>
              </div>

              {/* Details list */}
              <ul className="space-y-3.5 text-sm">
                {[
                  {
                    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
                    label: "Date",
                    value: workshop.date,
                  },
                  {
                    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                    label: "Time",
                    value: workshop.time,
                  },
                  {
                    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                    label: "Duration",
                    value: workshop.duration,
                  },
                  {
                    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                    label: "Location",
                    value: workshop.location,
                  },
                  {
                    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5",
                    label: "Deadline",
                    value: workshop.registrationDeadline,
                  },
                ].map(({ icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-orange-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                      />
                    </svg>
                    <div className="min-w-0">
                      <span className="text-[11px] font-black uppercase tracking-widest text-purple-950/30 block">
                        {label}
                      </span>
                      <span className="font-semibold text-purple-950/80 break-words">
                        {value}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Seats */}
              <div className="pt-4 border-t border-purple-950/5">
                <SeatsBar workshop={workshop} />
              </div>

              {/* Register button */}
              {canRegister ? (
                <button
                  onClick={handleRegister}
                  className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-md"
                >
                  {workshop.status === "Almost Full"
                    ? "Register — Almost Full!"
                    : "Register for this Workshop"}
                </button>
              ) : (
                <div className="w-full bg-slate-100 text-purple-950/40 font-black py-4 rounded-xl text-sm tracking-wide text-center">
                  {workshop.status === "Completed"
                    ? "Workshop Completed"
                    : "Registration Closed"}
                </div>
              )}

              <p className="text-center text-[11px] text-purple-950/30 font-medium">
                Registration closes {workshop.registrationDeadline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
