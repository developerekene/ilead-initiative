import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  setUser,
  setLoading,
  setError,
  clearError,
  selectUserLoading,
  selectUserError,
} from "../../redux/slices/User";
import type { AppDispatch } from "../../redux/store";
import { addNotification } from "../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";
import { FcGoogle } from "react-icons/fc";
import { authService } from "../../redux/configuration/services/auth.service";

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

const googleProvider = new GoogleAuthProvider();

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname;

  const isLoading = useSelector(selectUserLoading);
  const authError = useSelector(selectUserError);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || authError;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalError(null);
    dispatch(clearError());
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Rehydrate Redux from Firestore after any sign-in method
  const hydrateUser = async (
    uid: string,
    fallback: { email: string; displayName: string; photoURL: string | null },
  ) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        const primary = data?.user?.primaryInformation ?? {};
        dispatch(
          setUser({
            uid,
            email: primary.email ?? fallback.email,
            firstName: primary.firstName ?? "",
            lastName: primary.lastName ?? "",
            displayName:
              `${primary.firstName ?? ""} ${primary.lastName ?? ""}`.trim() ||
              fallback.displayName,
            isLoggedIn: true,
            profileComplete: data?.profileComplete ?? false,
            photoURL: fallback.photoURL,
          }),
        );
        return data?.profileComplete ?? false;
      }
    } catch (err) {
      console.warn("Login: Firestore hydration failed", err);
    }
    // Firestore unavailable — set minimal state so the user isn't blocked
    dispatch(
      setUser({
        uid,
        email: fallback.email,
        displayName: fallback.displayName,
        isLoggedIn: true,
        profileComplete: false,
        photoURL: fallback.photoURL,
      }),
    );
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(clearError());

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await authService.handleUserLoginWithEmailPassword(
        formData.email,
        formData.password,
      );
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `login-${Date.now()}`,
          type: "GENERAL",
          title: "Welcome back!",
          message: "You've successfully signed in to your iLEAD account.",
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: formData.email || "You",
        }),
      );
      navigate(
        from ?? (result?.profileComplete ? "/dashboard" : "/complete-profile"),
        { replace: true },
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.";
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // const handleGoogleLogin = async () => {
  //   setLocalError(null);
  //   dispatch(clearError());
  //   dispatch(setLoading(true));
  //   try {
  //     const credential = await signInWithPopup(auth, googleProvider);
  //     const profileComplete = await hydrateUser(credential.user.uid, {
  //       email: credential.user.email ?? "",
  //       displayName: credential.user.displayName ?? "",
  //       photoURL: credential.user.photoURL,
  //     });
  //     navigate(profileComplete ? "/dashboard" : "/complete-profile", {
  //       replace: true,
  //     });
  //   } catch (err: unknown) {
  //     const message =
  //       err instanceof Error
  //         ? err.message
  //         : "Google sign in failed. Please try again.";
  //     dispatch(setError(message));
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };
  const handleGoogleLogin = async () => {
    setLocalError(null);
    dispatch(clearError());
    dispatch(setLoading(true));
    try {
      const result = await authService.handleGoogleAuth();
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: `google-login-${Date.now()}`,
          type: "GENERAL",
          title: "Welcome back!",
          message: "You've successfully signed in with Google.",
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: "iLEAD",
        }),
      );
      navigate(
        from ?? (result?.profileComplete ? "/dashboard" : "/complete-profile"),
        { replace: true },
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google sign in failed. Please try again.";
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        {/* ── Left Panel ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="font-black text-xl tracking-tight text-white mb-8 block">
              iLEAD
              <span className="text-orange-500 text-2xl leading-none">.</span>
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Welcome Back. <br />
              <span className="text-orange-400">Keep Building.</span>
            </h2>
            <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
              Sign back in to your iLEAD workspace and continue where you left
              off. Your community is waiting.
            </p>
          </div>

          <div className="my-8 relative z-10 w-full space-y-4">
            {[
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                color: "orange",
                stat: "850+",
                label: "Active peers connected",
              },
              {
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                color: "purple",
                stat: "450 hrs",
                label: "Mentorship hours gifted",
              },
              {
                icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
                color: "orange",
                stat: "84 Systems",
                label: "Workstations deployed",
              },
            ].map(({ icon, color, stat, label }) => (
              <div
                key={stat}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color === "orange" ? "bg-orange-500/20" : "bg-purple-400/20"}`}
                >
                  <svg
                    className={`w-5 h-5 ${color === "orange" ? "text-orange-400" : "text-purple-300"}`}
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
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-none">
                    {stat}
                  </p>
                  <p className="text-purple-300/70 text-xs font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-purple-300/60 font-medium">
            "I am because We are" - Stronger Together
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-purple-950 tracking-tight">
              Sign in to your Account
            </h3>
            <p className="text-sm text-purple-950/50 font-medium mt-1">
              Pick up right where your ecosystem journey paused.
            </p>
          </div>

          {displayError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="developer@ilead.com"
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 pl-1">
                <label className="text-xs font-bold text-purple-950/70">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-orange-500 hover:text-purple-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 pr-11 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-purple-950/[0.02]">
              <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
                Keep me signed in
              </span>
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${rememberMe ? "bg-orange-500" : "bg-slate-300"}`}
                aria-label="Toggle remember me"
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${rememberMe ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <FcGoogle size={24} />
                Continue with Google
              </button>
            </div>

            <p className="text-center text-xs text-purple-950/40 font-medium pt-2">
              Don't have an account?{" "}
              <Link
                to="/join-our-community"
                className="text-orange-500 font-bold hover:text-purple-900 transition-colors"
              >
                Join the community
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
