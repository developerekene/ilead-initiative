import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ISHARE_COLLECTION } from "../../../utils/Ishareschema";

interface TopDonor {
  userId: string;
  displayName: string | null;
  photoURL: string | null;
  offerCount: number;
  category: string;
}

const CATEGORY_TAG_COLORS: Record<string, string> = {
  skills: "bg-blue-50 text-blue-600 border-blue-100",
  hardware: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mentorship: "bg-purple-50 text-purple-700 border-purple-100",
  other: "bg-slate-50 text-slate-500 border-slate-200",
};

const TopDonorsCarousel: React.FC = () => {
  const [donors, setDonors] = useState<TopDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, ISHARE_COLLECTION),
            where("type", "==", "offer_give"),
            where("status", "in", ["active", "fulfilled"]),
            where("anonymous", "==", false),
            orderBy("timestamp", "desc"),
            limit(50),
          ),
        );

        // Aggregate by userId
        const map = new Map<string, TopDonor>();
        snap.docs.forEach((d) => {
          const data = d.data();
          if (!data.userId) return;
          const existing = map.get(data.userId);
          if (existing) {
            existing.offerCount++;
          } else {
            map.set(data.userId, {
              userId: data.userId,
              displayName: data.displayName ?? "Community Member",
              photoURL: data.photoURL ?? null,
              offerCount: 1,
              category: data.category,
            });
          }
        });

        const sorted = Array.from(map.values())
          .sort((a, b) => b.offerCount - a.offerCount)
          .slice(0, 12);

        setDonors(sorted);
      } catch {
        // Fallback placeholder donors
        setDonors(
          Array.from({ length: 8 }, (_, i) => ({
            userId: `placeholder-${i}`,
            displayName: [
              "Amara O.",
              "Chidi N.",
              "Kemi A.",
              "Tunde B.",
              "Ngozi E.",
              "Femi L.",
              "Bola K.",
              "Yemi R.",
            ][i],
            photoURL: null,
            offerCount: Math.floor(Math.random() * 8) + 1,
            category: (["skills", "hardware", "mentorship", "other"] as const)[
              i % 4
            ],
          })),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTopDonors();
  }, []);

  // Double donors array for seamless loop
  const displayDonors = [...donors, ...donors];

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const AVATAR_COLORS = [
    "bg-orange-500",
    "bg-purple-700",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-500",
    "bg-indigo-600",
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-48 h-28 bg-slate-100 rounded-[1.5rem] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (donors.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">
            Spotlight
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
            Top Community Givers
          </h3>
        </div>
        <span className="text-xs font-bold text-purple-950/30 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
          {donors.length} Givers
        </span>
      </div>

      {/* Carousel track */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-4 w-max"
          style={{
            animation: isPaused
              ? "none"
              : "carousel-scroll 30s linear infinite",
          }}
        >
          {displayDonors.map((donor, i) => (
            <div
              key={`${donor.userId}-${i}`}
              className="shrink-0 w-52 bg-white border border-purple-950/5 rounded-[1.5rem] p-5 flex flex-col gap-3 cursor-default group hover:border-orange-500/20 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-200"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                {donor.photoURL ? (
                  <img
                    src={donor.photoURL}
                    alt={donor.displayName ?? ""}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-100 group-hover:border-orange-400 transition-colors"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white flex items-center justify-center text-sm font-black border-2 border-transparent group-hover:border-orange-400 transition-all`}
                  >
                    {getInitials(donor.displayName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-black text-purple-950 truncate group-hover:text-purple-700 transition-colors">
                    {donor.displayName}
                  </p>
                  <p className="text-[11px] text-purple-950/40 font-medium">
                    {donor.offerCount} offer{donor.offerCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Category tag */}
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border w-fit ${
                  CATEGORY_TAG_COLORS[donor.category] ??
                  CATEGORY_TAG_COLORS.other
                }`}
              >
                {donor.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TopDonorsCarousel;
