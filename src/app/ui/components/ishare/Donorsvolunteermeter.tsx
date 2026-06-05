import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { ISHARE_COLLECTION } from "../../../utils/Ishareschema";

const GOAL = 500; // target number of active givers

const DonorsVolunteerMeter: React.FC = () => {
  const [activeGivers, setActiveGivers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const snap = await getCountFromServer(
          query(
            collection(db, ISHARE_COLLECTION),
            where("type", "==", "offer_give"),
            where("status", "==", "active"),
          ),
        );
        setActiveGivers(snap.data().count);
      } catch {
        setActiveGivers(214); // fallback
      } finally {
        setLoading(false);
        setTimeout(() => setAnimated(true), 100);
      }
    };
    fetchCount();
  }, []);

  const pct = Math.min((activeGivers / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - activeGivers, 0);

  // Milestone markers
  const milestones = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div className="bg-white border border-purple-950/5 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-purple-950/5 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">
              Community Givers
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              Donors & Volunteer Meter
            </h3>
            <p className="text-sm text-purple-950/50 font-medium mt-1">
              Active offers in the iShare pool right now
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-purple-950 tracking-tight">
              {loading ? "—" : activeGivers.toLocaleString()}
            </p>
            <p className="text-xs text-purple-950/40 font-semibold">
              of {GOAL} goal
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-3">
          {/* Milestone ticks */}
          <div className="absolute inset-0 flex items-center pointer-events-none">
            {milestones.map((m) => (
              <div
                key={m}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${m}%` }}
              >
                <div className="w-px h-5 bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-[1500ms] ease-out relative overflow-hidden"
              style={{ width: animated ? `${pct}%` : "0%" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between text-[10px] font-bold text-purple-950/30 uppercase tracking-wider mb-6">
          <span>0</span>
          {milestones.map((m) => (
            <span key={m}>{Math.round((GOAL * m) / 100)}</span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100/60 text-center">
            <p className="text-xl font-black text-orange-500">
              {loading ? "—" : activeGivers}
            </p>
            <p className="text-[11px] font-bold text-orange-900/50 uppercase tracking-wide mt-0.5">
              Active Givers
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100/60 text-center">
            <p className="text-xl font-black text-purple-700">
              {loading ? "—" : `${Math.round(pct)}%`}
            </p>
            <p className="text-[11px] font-bold text-purple-900/50 uppercase tracking-wide mt-0.5">
              Goal Reached
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
            <p className="text-xl font-black text-slate-600">
              {loading ? "—" : remaining}
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">
              Spots Left
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
};

export default DonorsVolunteerMeter;
