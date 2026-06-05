import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  sendPasswordReset,
  selectUserLoading,
  selectUserError,
  clearError,
} from "../../redux/slices/Userslice";
import type { AppDispatch } from "../../redux/store";

// Step types
type Step = "request" | "sent";

// Eye icons
const EyeOpenIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeClosedIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

// Step indicator dot
const StepDot: React.FC<{ active: boolean; done: boolean; label: string }> = ({
  active,
  done,
  label,
}) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        done
          ? "bg-orange-500 text-white"
          : active
            ? "bg-white text-purple-950 shadow-md"
            : "bg-white/10 text-white/30"
      }`}
    >
      {done ? (
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
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      ) : (
        <span className="text-xs font-black">{label}</span>
      )}
    </div>
  </div>
);

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector(selectUserLoading);
  const authError = useSelector(selectUserError);

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const displayError = localError || authError;

  // Handle email submission — sends reset link
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(clearError());

    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    const result = await dispatch(sendPasswordReset({ email }));

    if (sendPasswordReset.fulfilled.match(result)) {
      setStep("sent");
      startResendCooldown();
    }
  };

  // 60-second cooldown before allowing resend
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLocalError(null);
    dispatch(clearError());
    const result = await dispatch(sendPasswordReset({ email }));
    if (sendPasswordReset.fulfilled.match(result)) {
      startResendCooldown();
    }
  };

  return (
    <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        {/* ── Left Panel ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand */}
          <div>
            <span className="font-black text-xl tracking-tight text-white mb-8 block">
              iLEAD
              <span className="text-orange-500 text-2xl leading-none">.</span>
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Reset your Access. <br />
              <span className="text-orange-400">Stay in the Circle.</span>
            </h2>
            <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
              Losing access happens. What matters is that you get back to your
              community quickly and securely. We've got you covered.
            </p>
          </div>

          {/* Step progress tracker */}
          <div className="my-8 relative z-10 w-full">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-300/60 mb-6">
              Recovery Steps
            </p>

            <div className="flex flex-col gap-0">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <StepDot
                    active={step === "request"}
                    done={step === "sent"}
                    label="1"
                  />
                  <div className="w-px h-10 bg-white/10 mt-1" />
                </div>
                <div className="pt-1 pb-6">
                  <p
                    className={`text-sm font-black transition-colors ${step === "request" ? "text-white" : step === "sent" ? "text-orange-400" : "text-white/30"}`}
                  >
                    Enter your email
                  </p>
                  <p className="text-xs text-purple-300/50 font-medium mt-0.5">
                    We'll send a secure reset link
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <StepDot active={step === "sent"} done={false} label="2" />
                  <div className="w-px h-10 bg-white/10 mt-1" />
                </div>
                <div className="pt-1 pb-6">
                  <p
                    className={`text-sm font-black transition-colors ${step === "sent" ? "text-white" : "text-white/30"}`}
                  >
                    Check your inbox
                  </p>
                  <p className="text-xs text-purple-300/50 font-medium mt-0.5">
                    Open the link from iLEAD
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <StepDot active={false} done={false} label="3" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-black text-white/30">
                    Create new password
                  </p>
                  <p className="text-xs text-purple-300/50 font-medium mt-0.5">
                    Back in your workspace
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-purple-300/60 font-medium">
            "I am because We are" - Stronger Together
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {/* ── STEP 1: Request reset ── */}
          {step === "request" && (
            <>
              {/* Back link */}
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-950/40 hover:text-orange-500 transition-colors mb-10 w-fit"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                Back to Sign In
              </Link>

              <div className="mb-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-purple-950 tracking-tight">
                  Forgot your Password?
                </h3>
                <p className="text-sm text-purple-950/50 font-medium mt-1.5 max-w-sm leading-relaxed">
                  No problem. Enter the email address tied to your iLEAD account
                  and we'll send you a secure reset link instantly.
                </p>
              </div>

              {/* Error Banner */}
              {displayError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
                  {displayError}
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLocalError(null);
                      dispatch(clearError());
                    }}
                    placeholder="developer@ilead.com"
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Info note */}
                <div className="flex items-start gap-3 bg-purple-50/60 border border-purple-100/60 rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-purple-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <p className="text-xs text-purple-950/50 font-medium leading-relaxed">
                    The reset link expires in{" "}
                    <span className="font-bold text-purple-950/70">
                      15 minutes
                    </span>
                    . Check your spam folder if you don't see it in your inbox.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 hover:shadow-purple-900/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
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
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-purple-950/40 font-medium pt-1">
                  Remember your password?{" "}
                  <Link
                    to="/sign-in"
                    className="text-orange-500 font-bold hover:text-purple-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}

          {/* ── STEP 2: Email sent confirmation ── */}
          {step === "sent" && (
            <div className="flex flex-col items-center text-center max-w-sm mx-auto">
              {/* Animated success icon */}
              <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mb-8 relative">
                <svg
                  className="w-9 h-9 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping" />
              </div>

              <h3 className="text-2xl font-black text-purple-950 tracking-tight mb-3">
                Check your Inbox
              </h3>
              <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-2">
                We've sent a reset link to
              </p>
              <p className="text-sm font-black text-purple-950 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 mb-8 break-all">
                {email}
              </p>

              {/* Steps reminder */}
              <div className="w-full bg-slate-50 rounded-2xl border border-purple-950/5 p-5 mb-8 text-left space-y-3">
                {[
                  { num: "1", text: "Open the email from iLEAD" },
                  { num: "2", text: "Click the secure reset link" },
                  { num: "3", text: "Create your new password" },
                ].map((item) => (
                  <div key={item.num} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {item.num}
                    </span>
                    <span className="text-sm font-medium text-purple-950/70">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Resend */}
              <div className="w-full space-y-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  className="w-full bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Resending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend Reset Link"
                  )}
                </button>

                <Link
                  to="/sign-in"
                  className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Back to Sign In
                </Link>
              </div>

              <p className="text-xs text-purple-950/30 font-medium mt-6 leading-relaxed">
                The link expires in 15 minutes. If you don't see the email,
                check your spam or junk folder.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
