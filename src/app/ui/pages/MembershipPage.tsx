import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slices/User";

interface Tier {
  id: string;
  name: string;
  price: number;
  badge: string;
  badgeColor: string;
  tagline: string;
  accentColor: string;
  cardBg: string;
  buttonStyle: string;
  popular: boolean;
  features: string[];
  locked: string[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    badge: "Starter",
    badgeColor: "bg-purple-100 text-purple-700",
    tagline: "Explore the community at no cost.",
    accentColor: "border-purple-950/10",
    cardBg: "bg-white",
    buttonStyle:
      "border border-purple-950/20 text-purple-950 hover:bg-purple-50",
    popular: false,
    features: [
      "Browse all public campaigns",
      "Read community forums",
      "Monthly iLEAD newsletter",
      "Public event announcements",
      "View iTrain previews",
    ],
    locked: [
      "Join & comment on campaigns",
      "Mentorship matching",
      "iShare participation",
      "Certificate of contribution",
      "Priority support",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 2500,
    badge: "Community",
    badgeColor: "bg-slate-100 text-slate-600",
    tagline: "Get active in the iLEAD ecosystem.",
    accentColor: "border-slate-300",
    cardBg: "bg-white",
    buttonStyle:
      "border border-slate-400 text-slate-700 hover:bg-slate-50",
    popular: false,
    features: [
      "Everything in Free",
      "Join & comment on campaigns",
      "Full community forum access",
      "Basic iTrain content library",
      "Priority email support",
      "Member directory listing",
    ],
    locked: [
      "Mentorship matching",
      "iShare participation",
      "Certificate of contribution",
      "Leadership direct access",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 5000,
    badge: "Most Popular",
    badgeColor: "bg-orange-100 text-orange-700",
    tagline: "Unlock mentorship, sharing, and growth.",
    accentColor: "border-orange-400",
    cardBg: "bg-white",
    buttonStyle: "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20",
    popular: true,
    features: [
      "Everything in Silver",
      "Mentorship matching (2 sessions/mo)",
      "iShare participation — give & receive",
      "Full iTrain content library",
      "Certificate of contribution",
      "Top Givers leaderboard eligibility",
    ],
    locked: [
      "Unlimited mentorship sessions",
      "Featured profile badge",
      "Direct leadership access",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 10000,
    badge: "Premium",
    badgeColor: "bg-purple-950 text-white",
    tagline: "The full iLEAD experience, no limits.",
    accentColor: "border-purple-950",
    cardBg: "bg-white",
    buttonStyle:
      "bg-purple-950 hover:bg-purple-800 text-white shadow-md shadow-purple-950/20",
    popular: false,
    features: [
      "Everything in Gold",
      "Unlimited mentorship sessions",
      "Featured profile & verification badge",
      "Direct access to iLEAD leadership",
      "Early access to new features",
      "Custom community spotlight post",
      "Dedicated account support",
    ],
    locked: [],
  },
];

const CheckIcon = () => (
  <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-purple-950/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m6-6V9a4 4 0 00-8 0v2m10 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
  </svg>
);

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const handleSelect = (tier: Tier) => {
    if (!isLoggedIn) {
      navigate("/join-our-community");
      return;
    }
    // Future: wire up payment flow
  };

  const getPrice = (base: number) => {
    if (base === 0) return 0;
    return billing === "annual" ? Math.round(base * 10) : base;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-10 text-center">
        <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">
          Membership Plans
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 mb-4">
          Choose Your Level of{" "}
          <span className="text-orange-500">Impact</span>
        </h1>
        <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed max-w-2xl mx-auto">
          Whether you're just getting started or ready to lead, iLEAD has a
          membership tier built for your journey.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-1 bg-purple-50 border border-purple-950/10 rounded-xl p-1">
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                billing === b
                  ? "bg-white text-purple-950 shadow-sm border border-purple-950/10"
                  : "text-purple-950/50 hover:text-purple-950"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Annual"}
              {b === "annual" && (
                <span className="ml-2 text-[10px] font-black text-orange-500 uppercase tracking-wider">
                  Save 17%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Cards */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-[2rem] border-2 ${tier.accentColor} ${tier.cardBg} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/5 ${
                tier.popular ? "shadow-xl shadow-orange-500/10" : "shadow-sm"
              }`}
            >
              {/* Popular ribbon */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md shadow-orange-500/30">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className="mb-6">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block mb-3 ${tier.badgeColor}`}
                >
                  {tier.badge}
                </span>
                <h2 className="text-2xl font-black text-purple-950 tracking-tight">
                  {tier.name}
                </h2>
                <p className="text-sm text-purple-950/50 font-medium mt-1 leading-snug">
                  {tier.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-purple-950/5">
                {tier.price === 0 ? (
                  <p className="text-4xl font-black text-purple-950 tracking-tight">
                    Free
                  </p>
                ) : (
                  <div>
                    <p className="text-4xl font-black text-purple-950 tracking-tight">
                      ₦{getPrice(tier.price).toLocaleString()}
                      <span className="text-base font-bold text-purple-950/40 ml-1">
                        /{billing === "annual" ? "yr" : "mo"}
                      </span>
                    </p>
                    {billing === "annual" && (
                      <p className="text-xs text-purple-950/40 font-medium mt-1">
                        ₦{Math.round(getPrice(tier.price) / 12).toLocaleString()}/mo billed annually
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-purple-950/80 font-medium">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
                {tier.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-purple-950/30 font-medium line-through">
                    <LockIcon />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSelect(tier)}
                className={`w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all duration-200 ${tier.buttonStyle}`}
              >
                {tier.price === 0
                  ? "Get Started Free"
                  : `Choose ${tier.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-purple-950/40 font-medium mt-10">
          All plans are billed in Nigerian Naira (₦). Cancel anytime. Questions?{" "}
          <a href="/contact" className="text-orange-500 hover:underline font-bold">
            Contact us
          </a>
          .
        </p>
      </div>

      {/* FAQ strip */}
      <div className="bg-purple-950 py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Still have questions?
          </h2>
          <p className="text-purple-200/70 font-medium text-sm mb-8">
            We're happy to walk you through the right plan for your goals.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all shadow-md shadow-orange-500/30"
          >
            Talk to Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
