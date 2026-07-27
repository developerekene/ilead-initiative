import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usePaystackPayment } from "react-paystack";
import {
  selectIsLoggedIn,
  selectUserPlan,
  selectUser,
  setPlan,
} from "../../../redux/slices/User";
import { addNotification } from "../../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";
import { FaCheck } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";
import { TIERS } from "../../../utils/data";
import { MembershipTier } from "../../../utils/types";
import toast from "react-hot-toast";
import { authService } from "../../../redux/configuration/services/auth.service";

// const PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_TEST as string;
const PAYSTACK_KEY =
  (process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE
    : process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_TEST) ?? "";

const MembershipPlan: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  const getPrice = (base: number) => {
    if (base === 0) return 0;
    return billing === "annual" ? Math.round(base * 10) : base;
  };

  // Initialize Paystack — config is built per-click via initializePayment(config)
  const initializePayment = usePaystackPayment({
    publicKey: PAYSTACK_KEY,
    email: user.email,
    amount: 0,
    currency: "NGN",
  });

  //   const completeUpgrade = (tier: MembershipTier) => {
  //     dispatch(setPlan(tier.id));
  //     setProcessingTier(null);
  //     toast.success(`Upgraded to ${tier.name}!`);
  //     // TODO: persist tier.id to Firestore so it survives refresh
  //   };

  const completeUpgrade = async (tier: MembershipTier, reference: string) => {
    try {
      await authService.handleMembershipPlan(tier.id, {
        reference,
        billing,
        amount: getPrice(tier.price),
      });
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `upgrade-${Date.now()}`,
          type: "COMPLETED",
          title: "Plan Upgraded!",
          message: `You've successfully upgraded to the ${tier.name} plan. Welcome to the next tier!`,
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: user?.displayName || "You",
        }),
      );
      toast.success(`Upgraded to ${tier.name}!`);
    } catch {
      toast.error(
        "Payment succeeded but saving your plan failed. Contact support.",
      );
    } finally {
      setProcessingTier(null);
    }
  };

  const handleSelect = (tier: MembershipTier) => {
    if (!isLoggedIn) {
      navigate("/join-our-community");
      return;
    }

    if (tier.id === currentPlan) {
      toast("You're already on this plan.", {
        style: { background: "#1e1b4b", color: "#fff" },
      });
      return;
    }

    if (tier.price === 0) {
      authService.handleMembershipPlan("free").catch(() => {});
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `free-plan-${Date.now()}`,
          type: "GENERAL",
          title: "Free Plan Activated",
          message:
            "You're now on the Free plan. Upgrade anytime to unlock more features.",
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: user?.displayName || "You",
        }),
      );
      toast.success("You're now on the Free plan.");
      return;
    }

    if (!PAYSTACK_KEY) {
      toast.error("Payment is not configured. Please contact support.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    const amountKobo = getPrice(tier.price) * 100; // Paystack works in kobo
    setProcessingTier(tier.id);

    initializePayment({
      config: {
        email: user.email,
        amount: amountKobo,
        currency: "NGN",
        metadata: {
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan_id",
              value: tier.id,
            },
            {
              display_name: "Billing",
              variable_name: "billing_cycle",
              value: billing,
            },
            {
              display_name: "User ID",
              variable_name: "uid",
              value: user.uid,
            },
          ],
        },
      },

      onSuccess: (reference: { reference: string }) => {
        completeUpgrade(tier, reference.reference);
      },
      onClose: () => {
        setProcessingTier(null);
        toast("Payment cancelled.", {
          style: { background: "#1e1b4b", color: "#fff" },
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-10 text-center">
        {/* <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">
          Membership Plans
        </span> */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 mb-4">
          Choose Your Level of <span className="text-orange-500">Impact</span>
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
          {TIERS.map((tier) => {
            const isCurrent = isLoggedIn && tier.id === currentPlan;
            const isProcessing = processingTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-[2rem] border-2 ${
                  isCurrent ? "border-purple-950" : tier.accentColor
                } ${tier.cardBg} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/5 ${
                  tier.popular ? "shadow-xl shadow-orange-500/10" : "shadow-sm"
                }`}
              >
                {isCurrent ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md shadow-purple-950/30">
                      Current Plan
                    </span>
                  </div>
                ) : (
                  tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md shadow-orange-500/30">
                        Most Popular
                      </span>
                    </div>
                  )
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
                          ₦
                          {Math.round(
                            getPrice(tier.price) / 12,
                          ).toLocaleString()}
                          /mo billed annually
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-purple-950/80 font-medium"
                    >
                      <FaCheck className="w-4 h-4 text-orange-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {tier.locked.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-purple-950/30 font-medium line-through"
                    >
                      <CiLock className="w-4 h-4 text-purple-950/20 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSelect(tier)}
                  disabled={isCurrent || isProcessing}
                  className={`w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-slate-100 text-purple-950/40 cursor-not-allowed"
                      : tier.buttonStyle
                  } ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : tier.price === 0 ? (
                    "Get Started Free"
                  ) : (
                    `Choose ${tier.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-purple-950/40 font-medium mt-10">
          All plans are billed in Nigerian Naira (₦). Cancel anytime. Questions?{" "}
          <a
            href="/contact"
            className="text-orange-500 hover:underline font-bold"
          >
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

export default MembershipPlan;
