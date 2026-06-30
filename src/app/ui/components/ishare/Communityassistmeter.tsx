import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { selectUser } from "../../../redux/slices/User";
import { ISHARE_COLLECTION } from "../../../utils/Ishareschema";

interface AssistMetrics {
  totalContacts: number; // pending_match + fulfilled posts by user
  offersClosed: number; // user's fulfilled offers
  requestsFulfilled: number; // user's fulfilled requests
}

interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  earned: boolean;
  color: string;
}

const CommunityAssistMeter: React.FC = () => {
  const user = useSelector(selectUser);
  const [metrics, setMetrics] = useState<AssistMetrics>({
    totalContacts: 0,
    offersClosed: 0,
    requestsFulfilled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const [contactsSnap, closedSnap, requestsSnap] = await Promise.all([
          getCountFromServer(
            query(
              collection(db, ISHARE_COLLECTION),
              where("userId", "==", user.uid),
              where("status", "in", ["pending_match", "fulfilled"]),
            ),
          ),
          getCountFromServer(
            query(
              collection(db, ISHARE_COLLECTION),
              where("userId", "==", user.uid),
              where("type", "==", "offer_give"),
              where("status", "==", "fulfilled"),
            ),
          ),
          getCountFromServer(
            query(
              collection(db, ISHARE_COLLECTION),
              where("userId", "==", user.uid),
              where("type", "==", "request_need"),
              where("status", "==", "fulfilled"),
            ),
          ),
        ]);

        setMetrics({
          totalContacts: contactsSnap.data().count,
          offersClosed: closedSnap.data().count,
          requestsFulfilled: requestsSnap.data().count,
        });
      } catch {
        setMetrics({ totalContacts: 0, offersClosed: 0, requestsFulfilled: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  // Computed badges based on metrics
  const badges: Badge[] = [
    {
      id: "first-offer",
      label: "First Give",
      icon: "🌱",
      description: "Posted your first offer",
      earned: metrics.offersClosed >= 1,
      color: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "triple-giver",
      label: "Triple Giver",
      icon: "🔥",
      description: "Closed 3 or more offers",
      earned: metrics.offersClosed >= 3,
      color: "bg-orange-50 border-orange-200",
    },
    {
      id: "connector",
      label: "Connector",
      icon: "🤝",
      description: "Made 5+ community contacts",
      earned: metrics.totalContacts >= 5,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "circle-keeper",
      label: "Circle Keeper",
      icon: "⭕",
      description: "Closed 10 or more offers",
      earned: metrics.offersClosed >= 10,
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: "problem-solver",
      label: "Problem Solver",
      icon: "💡",
      description: "Had a request fulfilled",
      earned: metrics.requestsFulfilled >= 1,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      id: "pillar",
      label: "Community Pillar",
      icon: "🏛️",
      description: "20+ total community interactions",
      earned: metrics.totalContacts >= 20,
      color: "bg-indigo-50 border-indigo-200",
    },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div className="bg-white border border-purple-950/5 rounded-[2rem] p-8 md:p-10 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">
              Your Impact
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
              Assist Fingerprint
            </h3>
            <p className="text-sm text-purple-950/50 font-medium mt-1">
              Your personal contribution profile within the iShare ecosystem
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-950 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
              />
            </svg>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Total Contacts",
              value: metrics.totalContacts,
              icon: "👥",
              bg: "bg-purple-50",
              border: "border-purple-100",
              text: "text-purple-700",
            },
            {
              label: "Offers Closed",
              value: metrics.offersClosed,
              icon: "✅",
              bg: "bg-orange-50",
              border: "border-orange-100",
              text: "text-orange-600",
            },
            {
              label: "Needs Fulfilled",
              value: metrics.requestsFulfilled,
              icon: "🎯",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              text: "text-emerald-700",
            },
          ].map((m) => (
            <div
              key={m.label}
              className={`${m.bg} border ${m.border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className={`text-2xl font-black ${m.text}`}>
                  {loading ? "—" : m.value}
                </p>
                <p className="text-xs font-bold text-purple-950/50 mt-0.5">
                  {m.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black text-purple-950">
              Achievement Badges
            </p>
            <span className="text-xs font-bold text-purple-950/40">
              {earnedCount}/{badges.length} earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                  badge.earned
                    ? `${badge.color} hover:shadow-sm`
                    : "bg-slate-50/80 border-slate-100 opacity-40 grayscale"
                }`}
              >
                <span className="text-xl shrink-0">{badge.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-purple-950 truncate">
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-purple-950/50 font-medium leading-tight mt-0.5 line-clamp-2">
                    {badge.description}
                  </p>
                </div>
                {badge.earned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityAssistMeter;
