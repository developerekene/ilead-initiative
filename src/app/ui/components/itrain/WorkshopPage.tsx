import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/slices/User";
import toast from "react-hot-toast";
import AcademicConsultationForm from "./AcademicConsultationForm";
import { workshops } from "../../../utils/data";
import { WorkshopTypes } from "../../../utils/types";
import SeatsBar from "./SeatsBar";

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

const WorkshopPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(workshops.map((w) => w.category))),
  ];

  const filtered = workshops.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      w.title.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.instructor.toLowerCase().includes(q) ||
      w.tags.some((t) => t.toLowerCase().includes(q));
    const matchCategory =
      activeCategory === "All" || w.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleRegister = (workshop: WorkshopTypes) => {
    if (!isLoggedIn) {
      toast.error("Sign in to register for a workshop.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", { state: { from: location } });
      return;
    }
    navigate(`/iTrain/workshops/${workshop.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-10">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">
            iTrain Workshops
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 mb-4">
            Learn. Grow. <span className="text-orange-500">Lead.</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
            Hands-on workshops designed by practitioners, for students who want
            more than a degree.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-950/30 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workshops, instructors, topics..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-purple-950/10 bg-slate-50 text-purple-950 placeholder:text-purple-950/30 font-medium text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                activeCategory === cat
                  ? "bg-purple-950 text-white border-purple-950"
                  : "bg-white text-purple-950/60 border-purple-950/10 hover:border-purple-950/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-purple-950/40 font-medium">
            No workshops found
            {searchQuery && ` for "${searchQuery}"`}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white border border-purple-950/5 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/5 hover:border-orange-500/20 group"
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 to-transparent" />
                  {/* Overlay badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                        MODE_STYLES[workshop.mode]
                      }`}
                    >
                      {workshop.mode}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                        LEVEL_STYLES[workshop.level]
                      }`}
                    >
                      {workshop.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                        STATUS_STYLES[workshop.status]
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {workshop.status}
                    </span>
                  </div>
                  {/* Price in corner */}
                  <div className="absolute bottom-4 right-4">
                    <span className="text-sm font-black text-white">
                      {workshop.price}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 flex flex-col flex-1">
                  {/* Category */}
                  <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 w-fit mb-4">
                    {workshop.category}
                  </span>

                  <h3 className="text-xl font-black text-purple-950 leading-snug mb-3 group-hover:text-purple-700 transition-colors">
                    {workshop.title}
                  </h3>

                  <p className="text-sm text-purple-950/60 font-medium leading-relaxed mb-5 line-clamp-2 flex-1">
                    {workshop.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 mb-5 text-xs font-medium text-purple-950/50">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <span className="font-semibold text-purple-950/70">
                        {workshop.instructor}
                      </span>
                      <span className="text-purple-950/30">·</span>
                      <span>{workshop.instructorRole}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
                        />
                      </svg>
                      <span>
                        {workshop.date} · {workshop.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      <span>
                        {workshop.location} · {workshop.duration}
                      </span>
                    </div>
                  </div>

                  {/* Seats bar */}
                  <div className="mb-6 pt-4 border-t border-purple-950/5">
                    <SeatsBar workshop={workshop} />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {workshop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold text-purple-950/40 bg-purple-50 px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/iTrain/workshops/${workshop.id}`}
                      className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-3 px-4 rounded-xl text-center text-sm transition-all duration-200"
                    >
                      View Workshop
                    </Link>
                    {workshop.status !== "Closed" &&
                      workshop.status !== "Completed" && (
                        <button
                          onClick={() => handleRegister(workshop)}
                          className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-3 px-4 rounded-xl text-sm tracking-wide transition-all duration-200"
                        >
                          {workshop.status === "Almost Full"
                            ? "Register — Almost Full!"
                            : "Register Now"}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA strip */}
      <div className="bg-purple-950 py-16 px-6 md:px-12 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Want to facilitate a workshop?
          </h2>
          <p className="text-purple-200/70 font-medium text-sm mb-8">
            Share your expertise with students who need it. We handle logistics
            — you handle the value.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all shadow-md shadow-orange-500/30"
          >
            Apply to Facilitate
          </button>
        </div>
      </div>
      <AcademicConsultationForm />
    </div>
  );
};

export default WorkshopPage;
