import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerWithEmail,
  loginWithGoogle,
  clearError,
  selectUserLoading,
  selectUserError,
  selectIsLoggedIn,
} from "../../redux/slices/Userslice";
import { AppDispatch } from "../../redux/store";

const EyeOff = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
         a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
         M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
         m7.532 7.532l3.29 3.29M3 3l3.59 3.59
         m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
         a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const EyeOn = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
         9.542 7-1.274 4.057-5.064 7-9.542 7
         -4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const friendlyError = (msg: string): string => {
  if (msg.includes("email-already-in-use"))
    return "An account with this email already exists. Try signing in instead.";
  if (msg.includes("invalid-email"))
    return "Please enter a valid email address.";
  if (msg.includes("weak-password"))
    return "Password is too weak. Use at least 8 characters.";
  if (msg.includes("popup-closed-by-user"))
    return "Google sign-in was cancelled. Please try again.";
  if (msg.includes("network-request-failed"))
    return "Network error. Check your connection and try again.";
  return "Something went wrong. Please try again.";
};

const JoinCommunity: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectUserLoading);
  const reduxError = useSelector(selectUserError);
  const isLoggedIn = useSelector(selectIsLoggedIn); // ← ADD THIS

  // ── Guard: already logged-in users should not be on this page ────────────
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const [accountType, setAccountType] = useState<"individual" | "contributor">(
    "individual",
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (reduxError) dispatch(clearError());
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-purple-950
     placeholder:text-purple-950/20 font-medium focus:outline-none focus:bg-white
     transition-all ${
       fieldErrors[field]
         ? "border-red-400 focus:border-red-400"
         : "border-purple-950/10 focus:border-orange-500"
     }`;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "Required";
    if (!formData.lastName.trim()) e.lastName = "Required";
    if (!formData.email.trim()) e.email = "Required";
    if (formData.password.length < 8) e.password = "Min 8 characters";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!acceptTerms) e.terms = "You must accept the terms";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    sessionStorage.setItem("ilead_account_type", accountType);
    sessionStorage.setItem(
      "ilead_reg_data",
      JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }),
    );

    try {
      await dispatch(
        registerWithEmail({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      ).unwrap();

      // Registration succeeded — isLoggedIn will flip to true via
      // onAuthStateChanged → useEffect above will navigate automatically.
      // But we also navigate directly here as an immediate fallback.
      navigate("/complete-profile", { replace: true });
    } catch {
      sessionStorage.removeItem("ilead_account_type");
      sessionStorage.removeItem("ilead_reg_data");
    }
  };

  const handleGoogleSignUp = async () => {
    sessionStorage.setItem("ilead_account_type", accountType);

    try {
      await dispatch(loginWithGoogle()).unwrap();
      navigate("/complete-profile", { replace: true });
    } catch {
      sessionStorage.removeItem("ilead_account_type");
    }
  };

  return (
    <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        {/* ── Left panel ─────────────────────────────────────────── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="font-black text-xl tracking-tight text-white mb-8 block">
              iLEAD
              <span className="text-orange-500 text-2xl leading-none">.</span>
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Step Out of Isolation. <br />
              <span className="text-orange-400">Build in Community.</span>
            </h2>
            <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
              Whether you are here to share high-level industry expertise or
              accelerate your technical career, you belong in our workspace
              network.
            </p>
          </div>

          <div className="my-8 flex justify-center items-center relative z-10 w-full">
            <figure className="text-center">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Cross-functional collaboration illustration"
                className="max-w-full h-auto rounded-2xl mx-auto object-cover"
              />
              <figcaption className="mt-3 text-xs text-purple-300/60 font-medium tracking-wide">
                Human-centric tech collaboration
              </figcaption>
            </figure>
          </div>

          <div className="text-xs text-purple-300/60 font-medium">
            "I am because We are" — Stronger Together
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────── */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-purple-950 tracking-tight">
              Create your Account
            </h3>
            <p className="text-sm text-purple-950/50 font-medium mt-1">
              Join a borderless ecosystem of developers and product creators.
            </p>
          </div>

          {/* Track toggle */}
          <div className="mb-8">
            <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-3">
              Select Workflow Track
            </label>
            <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-purple-950/[0.03]">
              {(["individual", "contributor"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                    accountType === type
                      ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
                      : "text-purple-950/50 hover:text-purple-950"
                  }`}
                >
                  Join as {type === "individual" ? "Individual" : "Contributor"}
                </button>
              ))}
            </div>
            <p className="text-xs text-purple-950/40 font-medium mt-2 pl-1">
              {accountType === "individual"
                ? "For builders, learners, and creators looking to grow within the ecosystem."
                : "For mentors, industry professionals, and founders ready to give back."}
            </p>
          </div>

          {/* Error banner */}
          {reduxError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-red-700 font-medium leading-relaxed">
                {friendlyError(reduxError)}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ekene"
                  className={inputCls("firstName")}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Okonkwo"
                  className={inputCls("lastName")}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="developer@ilead.com"
                className={inputCls("email")}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1 pl-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputCls("password") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputCls("confirmPassword") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 pl-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="pt-2">
              <div
                className={`flex items-center justify-between bg-slate-50 p-4 rounded-xl border transition-colors ${fieldErrors.terms ? "border-red-300 bg-red-50/30" : "border-purple-950/[0.02]"}`}
              >
                <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
                  Accept our{" "}
                  <Link
                    to="/terms"
                    className="text-purple-900 underline hover:text-orange-500 font-bold transition-colors"
                  >
                    terms and conditions
                  </Link>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptTerms((p) => !p);
                    if (fieldErrors.terms)
                      setFieldErrors((p) => ({ ...p, terms: "" }));
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ml-4 ${acceptTerms ? "bg-orange-500" : "bg-slate-300"}`}
                  aria-label="Toggle acceptance of terms"
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${acceptTerms ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
              {fieldErrors.terms && (
                <p className="text-xs text-red-500 mt-1 pl-1">
                  {fieldErrors.terms}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Creating account...
                  </>
                ) : (
                  "Join Community"
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.41 2.021 15.598 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.445 10.556-10.74 0-.726-.077-1.282-.175-1.69h-10.38z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="text-center text-xs text-purple-950/40 font-medium pt-2">
              Already have an account?{" "}
              {/* ← Link instead of <a> — prevents full page reload */}
              <Link
                to="/sign-in"
                className="text-orange-500 hover:text-purple-900 font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   registerWithEmail,
//   loginWithGoogle,
//   clearError,
//   selectUserLoading,
//   selectUserError,
//   selectIsLoggedIn,
// } from "../../redux/slices/Userslice";
// import { AppDispatch } from "../../redux/store";

// const EyeOff = () => (
//   <svg
//     className="w-4 h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
//                a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
//                M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
//                m7.532 7.532l3.29 3.29M3 3l3.59 3.59
//                m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
//                a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//     />
//   </svg>
// );
// const EyeOn = () => (
//   <svg
//     className="w-4 h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
//                9.542 7-1.274 4.057-5.064 7-9.542 7
//                -4.477 0-8.268-2.943-9.542-7z"
//     />
//   </svg>
// );

// // ─── Friendly Firebase error messages ────────────────────────────────────────
// const friendlyError = (msg: string): string => {
//   if (msg.includes("email-already-in-use"))
//     return "An account with this email already exists. Try signing in instead.";
//   if (msg.includes("invalid-email"))
//     return "Please enter a valid email address.";
//   if (msg.includes("weak-password"))
//     return "Password is too weak. Use at least 8 characters.";
//   if (msg.includes("popup-closed-by-user"))
//     return "Google sign-in was cancelled. Please try again.";
//   if (msg.includes("network-request-failed"))
//     return "Network error. Check your connection and try again.";
//   return "Something went wrong. Please try again.";
// };

// const JoinCommunity: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   // Redux state
//   const loading = useSelector(selectUserLoading);
//   const reduxError = useSelector(selectUserError);
//   const isLoggedIn = useSelector(selectIsLoggedIn);

//   // Local form state
//   const [accountType, setAccountType] = useState<"individual" | "contributor">(
//     "individual",
//   );
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   // ── If user becomes authenticated (e.g. after Google sign-in),
//   //    stash accountType and redirect to profile completion
//   useEffect(() => {
//     if (isLoggedIn) {
//       sessionStorage.setItem("ilead_account_type", accountType);
//       sessionStorage.setItem(
//         "ilead_reg_data",
//         JSON.stringify({
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           email: formData.email,
//         }),
//       );
//       navigate("/complete-profile", { replace: true });
//     }
//   }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Clear Redux error when user starts editing
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//     if (reduxError) dispatch(clearError());
//   };

//   const inputCls = (field: string) =>
//     `w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-purple-950
//          placeholder:text-purple-950/20 font-medium focus:outline-none focus:bg-white
//          transition-all ${
//            fieldErrors[field]
//              ? "border-red-400 focus:border-red-400"
//              : "border-purple-950/10 focus:border-orange-500"
//          }`;

//   // Client-side validation
//   const validate = (): boolean => {
//     const e: Record<string, string> = {};
//     if (!formData.firstName.trim()) e.firstName = "Required";
//     if (!formData.lastName.trim()) e.lastName = "Required";
//     if (!formData.email.trim()) e.email = "Required";
//     if (formData.password.length < 8) e.password = "Min 8 characters";
//     if (formData.password !== formData.confirmPassword)
//       e.confirmPassword = "Passwords do not match";
//     if (!acceptTerms) e.terms = "You must accept the terms";
//     setFieldErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // Email / password registration
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // Stash data before dispatching so the useEffect redirect picks it up
//     sessionStorage.setItem("ilead_account_type", accountType);
//     sessionStorage.setItem(
//       "ilead_reg_data",
//       JSON.stringify({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//       }),
//     );

//     dispatch(
//       registerWithEmail({
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//       }),
//     );
//     // Navigation is handled by the isLoggedIn useEffect above
//   };

//   // Google sign-up
//   const handleGoogleSignUp = () => {
//     sessionStorage.setItem("ilead_account_type", accountType);
//     dispatch(loginWithGoogle());
//     // Navigation is handled by the isLoggedIn useEffect above
//   };

//   return (
//     <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
//       <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
//         {/* ── Left panel */}
//         <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
//           <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

//           <div>
//             <span className="font-black text-xl tracking-tight text-white mb-8 block">
//               iLEAD
//               <span className="text-orange-500 text-2xl leading-none">.</span>
//             </span>
//             <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
//               Step Out of Isolation. <br />
//               <span className="text-orange-400">Build in Community.</span>
//             </h2>
//             <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
//               Whether you are here to share high-level industry expertise or
//               accelerate your technical career, you belong in our workspace
//               network.
//             </p>
//           </div>

//           <div className="my-8 flex justify-center items-center relative z-10 w-full">
//             <figure className="text-center">
//               <img
//                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
//                 alt="Cross-functional collaboration illustration"
//                 className="max-w-full h-auto rounded-2xl mx-auto object-cover"
//               />
//               <figcaption className="mt-3 text-xs text-purple-300/60 font-medium tracking-wide">
//                 Human-centric tech collaboration
//               </figcaption>
//             </figure>
//           </div>

//           <div className="text-xs text-purple-300/60 font-medium">
//             "I am because We are" — Stronger Together
//           </div>
//         </div>

//         {/* ── Right panel  */}
//         <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
//           <div className="mb-8">
//             <h3 className="text-2xl font-black text-purple-950 tracking-tight">
//               Create your Account
//             </h3>
//             <p className="text-sm text-purple-950/50 font-medium mt-1">
//               Join a borderless ecosystem of developers and product creators.
//             </p>
//           </div>

//           {/* Track toggle */}
//           <div className="mb-8">
//             <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-3">
//               Select Workflow Track
//             </label>
//             <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-purple-950/[0.03]">
//               {(["individual", "contributor"] as const).map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => setAccountType(type)}
//                   className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
//                     accountType === type
//                       ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
//                       : "text-purple-950/50 hover:text-purple-950"
//                   }`}
//                 >
//                   Join as {type === "individual" ? "Individual" : "Contributor"}
//                 </button>
//               ))}
//             </div>
//             <p className="text-xs text-purple-950/40 font-medium mt-2 pl-1">
//               {accountType === "individual"
//                 ? "For builders, learners, and creators looking to grow within the ecosystem."
//                 : "For mentors, industry professionals, and founders ready to give back."}
//             </p>
//           </div>

//           {/* Redux / Firebase error banner */}
//           {reduxError && (
//             <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
//               <svg
//                 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <p className="text-xs text-red-700 font-medium leading-relaxed">
//                 {friendlyError(reduxError)}
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//             {/* Name */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="Ekene"
//                   className={inputCls("firstName")}
//                 />
//                 {fieldErrors.firstName && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {fieldErrors.firstName}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Okonkwo"
//                   className={inputCls("lastName")}
//                 />
//                 {fieldErrors.lastName && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {fieldErrors.lastName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="developer@ilead.com"
//                 className={inputCls("email")}
//               />
//               {fieldErrors.email && (
//                 <p className="text-xs text-red-500 mt-1 pl-1">
//                   {fieldErrors.email}
//                 </p>
//               )}
//             </div>

//             {/* Passwords */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     className={inputCls("password") + " pr-10"}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => !p)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? <EyeOff /> : <EyeOn />}
//                   </button>
//                 </div>
//                 {fieldErrors.password && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {fieldErrors.password}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirm ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="••••••••"
//                     className={inputCls("confirmPassword") + " pr-10"}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm((p) => !p)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
//                     aria-label="Toggle confirm password visibility"
//                   >
//                     {showConfirm ? <EyeOff /> : <EyeOn />}
//                   </button>
//                 </div>
//                 {fieldErrors.confirmPassword && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {fieldErrors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Terms */}
//             <div className="pt-2">
//               <div
//                 className={`flex items-center justify-between bg-slate-50 p-4 rounded-xl border transition-colors ${fieldErrors.terms ? "border-red-300 bg-red-50/30" : "border-purple-950/[0.02]"}`}
//               >
//                 <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
//                   Accept our{" "}
//                   <a
//                     href="/terms"
//                     className="text-purple-900 underline hover:text-orange-500 font-bold transition-colors"
//                   >
//                     terms and conditions
//                   </a>
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setAcceptTerms((p) => !p);
//                     if (fieldErrors.terms)
//                       setFieldErrors((p) => ({ ...p, terms: "" }));
//                   }}
//                   className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ml-4 ${acceptTerms ? "bg-orange-500" : "bg-slate-300"}`}
//                   aria-label="Toggle acceptance of terms"
//                 >
//                   <div
//                     className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${acceptTerms ? "translate-x-5" : "translate-x-0"}`}
//                   />
//                 </button>
//               </div>
//               {fieldErrors.terms && (
//                 <p className="text-xs text-red-500 mt-1 pl-1">
//                   {fieldErrors.terms}
//                 </p>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-orange-500 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       className="animate-spin w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8H4z"
//                       />
//                     </svg>
//                     Creating account...
//                   </>
//                 ) : (
//                   "Join Community"
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleGoogleSignUp}
//                 disabled={loading}
//                 className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
//               >
//                 <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
//                   <path
//                     fill="#EA4335"
//                     d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.41 2.021 15.598 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.445 10.556-10.74 0-.726-.077-1.282-.175-1.69h-10.38z"
//                   />
//                 </svg>
//                 Continue with Google
//               </button>
//             </div>

//             <p className="text-center text-xs text-purple-950/40 font-medium pt-2">
//               Already have an account?{" "}
//               <a
//                 href="/login"
//                 className="text-orange-500 hover:text-purple-900 font-bold transition-colors"
//               >
//                 Sign in
//               </a>
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default JoinCommunity;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const JoinCommunity: React.FC = () => {
//   const navigate = useNavigate();

//   const [accountType, setAccountType] = useState<"contributor" | "individual">(
//     "individual",
//   );

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error on change
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.firstName.trim()) newErrors.firstName = "Required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Required";
//     if (!formData.email.trim()) newErrors.email = "Required";
//     if (formData.password.length < 8) newErrors.password = "Min 8 characters";
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";
//     if (!acceptTerms) newErrors.terms = "You must accept the terms";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     // Persist account type so CompleteProfile can read it
//     sessionStorage.setItem("ilead_account_type", accountType);
//     sessionStorage.setItem(
//       "ilead_reg_data",
//       JSON.stringify({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//       }),
//     );
//     navigate("/complete-profile");
//   };

//   const handleGoogleSignUp = () => {
//     sessionStorage.setItem("ilead_account_type", accountType);
//     console.log("Initiating Google OAuth flow for:", accountType);
//     // After OAuth resolves, navigate to /complete-profile
//   };

//   const inputClass = (field: string) =>
//     `w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:bg-white transition-all ${
//       errors[field]
//         ? "border-red-400 focus:border-red-400"
//         : "border-purple-950/10 focus:border-orange-500"
//     }`;

//   return (
//     <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
//       <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
//         {/* Left Panel */}
//         <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
//           <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

//           <div>
//             <span className="font-black text-xl tracking-tight text-white mb-8 block">
//               iLEAD
//               <span className="text-orange-500 text-2xl leading-none">.</span>
//             </span>
//             <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
//               Step Out of Isolation. <br />
//               <span className="text-orange-400">Build in Community.</span>
//             </h2>
//             <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
//               Whether you are here to share high-level industry expertise or
//               accelerate your technical career, you belong in our workspace
//               network.
//             </p>
//           </div>

//           <div className="my-8 flex justify-center items-center relative z-10 w-full">
//             <figure className="text-center">
//               <img
//                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
//                 alt="Cross-functional collaboration illustration"
//                 className="max-w-full h-auto rounded-2xl mx-auto object-cover"
//               />
//               <figcaption className="mt-3 text-xs text-purple-300/60 font-medium tracking-wide">
//                 Human-centric tech collaboration
//               </figcaption>
//             </figure>
//           </div>

//           <div className="text-xs text-purple-300/60 font-medium">
//             "I am because We are" — Stronger Together
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
//           <div className="mb-8">
//             <h3 className="text-2xl font-black text-purple-950 tracking-tight">
//               Create your Account
//             </h3>
//             <p className="text-sm text-purple-950/50 font-medium mt-1">
//               Join a borderless ecosystem of developers and product creators.
//             </p>
//           </div>

//           {/* Workflow Track Toggle */}
//           <div className="mb-8">
//             <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-3">
//               Select Workflow Track
//             </label>
//             <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-purple-950/[0.03]">
//               <button
//                 type="button"
//                 onClick={() => setAccountType("individual")}
//                 className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
//                   accountType === "individual"
//                     ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
//                     : "text-purple-950/50 hover:text-purple-950"
//                 }`}
//               >
//                 Join as Individual
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setAccountType("contributor")}
//                 className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
//                   accountType === "contributor"
//                     ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
//                     : "text-purple-950/50 hover:text-purple-950"
//                 }`}
//               >
//                 Join as Contributor
//               </button>
//             </div>

//             {/* Track context hint */}
//             <p className="text-xs text-purple-950/40 font-medium mt-2 pl-1">
//               {accountType === "individual"
//                 ? "For builders, learners, and creators looking to grow within the ecosystem."
//                 : "For mentors, industry professionals, and founders ready to give back."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5" noValidate>
//             {/* Name row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder="Ekene"
//                   className={inputClass("firstName")}
//                 />
//                 {errors.firstName && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder="Okonkwo"
//                   className={inputClass("lastName")}
//                 />
//                 {errors.lastName && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {errors.lastName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="developer@ilead.com"
//                 className={inputClass("email")}
//               />
//               {errors.email && (
//                 <p className="text-xs text-red-500 mt-1 pl-1">{errors.email}</p>
//               )}
//             </div>

//             {/* Passwords */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className={inputClass("password") + " pr-10"}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((p) => !p)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? (
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {errors.password}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className={inputClass("confirmPassword") + " pr-10"}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword((p) => !p)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-purple-950/60 transition-colors"
//                     aria-label="Toggle confirm password visibility"
//                   >
//                     {showConfirmPassword ? (
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-xs text-red-500 mt-1 pl-1">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Terms toggle */}
//             <div className="pt-2">
//               <div
//                 className={`flex items-center justify-between bg-slate-50 p-4 rounded-xl border transition-colors ${errors.terms ? "border-red-300 bg-red-50/30" : "border-purple-950/[0.02]"}`}
//               >
//                 <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
//                   Accept our{" "}
//                   <a
//                     href="/terms"
//                     className="text-purple-900 underline hover:text-orange-500 font-bold transition-colors"
//                   >
//                     terms and conditions
//                   </a>
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setAcceptTerms((prev) => !prev);
//                     if (errors.terms)
//                       setErrors((prev) => ({ ...prev, terms: "" }));
//                   }}
//                   className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer flex-shrink-0 ml-4 ${
//                     acceptTerms ? "bg-orange-500" : "bg-slate-300"
//                   }`}
//                   aria-label="Toggle acceptance of terms"
//                 >
//                   <div
//                     className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
//                       acceptTerms ? "translate-x-5" : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               </div>
//               {errors.terms && (
//                 <p className="text-xs text-red-500 mt-1 pl-1">{errors.terms}</p>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-orange-500 hover:bg-purple-900 text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 hover:shadow-purple-900/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
//               >
//                 Join Community
//               </button>

//               <button
//                 type="button"
//                 onClick={handleGoogleSignUp}
//                 className="w-full bg-white hover:bg-slate-50 border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
//               >
//                 <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
//                   <path
//                     fill="#EA4335"
//                     d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.41 2.021 15.598 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.445 10.556-10.74 0-.726-.077-1.282-.175-1.69h-10.38z"
//                   />
//                 </svg>
//                 Continue with Google
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default JoinCommunity;

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   registerWithEmail,
//   loginWithGoogle,
//   selectUserLoading,
//   selectUserError,
//   clearError,
// } from "../../redux/slices/Userslice";
// import type { AppDispatch } from "../../redux/store";

// // Eye icons as inline SVG components
// const EyeOpenIcon = () => (
//   <svg
//     className="w-4 h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );

// const EyeClosedIcon = () => (
//   <svg
//     className="w-4 h-4"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     strokeWidth={2}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//     />
//   </svg>
// );

// const JoinCommunity: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const isLoading = useSelector(selectUserLoading);
//   const authError = useSelector(selectUserError);

//   const [accountType, setAccountType] = useState<"contributor" | "individual">(
//     "individual",
//   );
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);

//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLocalError(null);
//     dispatch(clearError());
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError(null);

//     if (!acceptTerms) {
//       setLocalError("Please accept the terms and conditions to continue.");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setLocalError("Passwords do not match.");
//       return;
//     }
//     if (formData.password.length < 6) {
//       setLocalError("Password must be at least 6 characters.");
//       return;
//     }

//     const result = await dispatch(
//       registerWithEmail({
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//       }),
//     );

//     if (registerWithEmail.fulfilled.match(result)) {
//       navigate("/dashboard");
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     setLocalError(null);
//     dispatch(clearError());

//     const result = await dispatch(loginWithGoogle());

//     if (loginWithGoogle.fulfilled.match(result)) {
//       navigate("/dashboard");
//     }
//   };

//   const displayError = localError || authError;

//   return (
//     <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
//       <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
//         {/* Left Panel */}
//         <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
//           <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
//           <div>
//             <span className="font-black text-xl tracking-tight text-white mb-8 block">
//               iLEAD
//               <span className="text-orange-500 text-2xl leading-none">.</span>
//             </span>
//             <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">
//               Step Out of Isolation. <br />
//               <span className="text-orange-400">Build in Community.</span>
//             </h2>
//             <p className="text-purple-200 text-sm font-medium leading-relaxed max-w-sm">
//               Whether you are here to share high-level industry expertise or
//               accelerate your technical career, you belong in our workspace
//               network.
//             </p>
//           </div>
//           <div className="my-8 flex justify-center items-center relative z-10 w-full">
//             <figure className="text-center">
//               <img
//                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
//                 alt="Cross-functional collaboration"
//                 className="max-w-full h-auto rounded-2xl mx-auto object-cover"
//               />
//               <figcaption className="mt-3 text-xs text-purple-300/60 font-medium tracking-wide">
//                 Human-centric tech collaboration
//               </figcaption>
//             </figure>
//           </div>
//           <div className="text-xs text-purple-300/60 font-medium">
//             "I am because We are" - Stronger Together
//           </div>
//         </div>

//         {/* Right Panel — Form */}
//         <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
//           <div className="mb-8">
//             <h3 className="text-2xl font-black text-purple-950 tracking-tight">
//               Create your Account
//             </h3>
//             <p className="text-sm text-purple-950/50 font-medium mt-1">
//               Join a borderless ecosystem of developers and product creators.
//             </p>
//           </div>

//           {/* Account Type Toggle */}
//           <div className="mb-8">
//             <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-3">
//               Select Workflow Track
//             </label>
//             <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-purple-950/[0.03]">
//               <button
//                 type="button"
//                 onClick={() => setAccountType("individual")}
//                 className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
//                   accountType === "individual"
//                     ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
//                     : "text-purple-950/50 hover:text-purple-950"
//                 }`}
//               >
//                 Join as Individual
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setAccountType("contributor")}
//                 className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
//                   accountType === "contributor"
//                     ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
//                     : "text-purple-950/50 hover:text-purple-950"
//                 }`}
//               >
//                 Join as Contributor
//               </button>
//             </div>
//           </div>

//           {/* Error Banner */}
//           {displayError && (
//             <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
//               {displayError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   required
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder="Ekene"
//                   className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   required
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder="Okoli"
//                   className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="developer@ilead.com"
//                 className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//               />
//             </div>

//             {/* Password fields with eye toggle */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     required
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 pr-11 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((v) => !v)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     required
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="••••••••"
//                     className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 pr-11 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword((v) => !v)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
//                     aria-label={
//                       showConfirmPassword
//                         ? "Hide confirm password"
//                         : "Show confirm password"
//                     }
//                   >
//                     {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Terms Toggle */}
//             <div className="pt-2 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-purple-950/[0.02]">
//               <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
//                 Accept our{" "}
//                 <Link
//                   to="/terms-and-conditions"
//                   className="text-purple-900 underline hover:text-orange-500 font-bold transition-colors"
//                 >
//                   terms and conditions
//                 </Link>
//               </span>
//               <button
//                 type="button"
//                 onClick={() => setAcceptTerms(!acceptTerms)}
//                 className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
//                   acceptTerms ? "bg-orange-500" : "bg-slate-300"
//                 }`}
//                 aria-label="Toggle acceptance of terms"
//               >
//                 <div
//                   className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
//                     acceptTerms ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-orange-500 hover:bg-purple-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 hover:shadow-purple-900/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <>
//                     <svg
//                       className="animate-spin w-4 h-4"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8z"
//                       />
//                     </svg>
//                     Creating Account...
//                   </>
//                 ) : (
//                   "Join Community"
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleGoogleSignUp}
//                 disabled={isLoading}
//                 className="w-full bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
//               >
//                 <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
//                   <path
//                     fill="#EA4335"
//                     d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.41 2.021 15.598 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.556-4.445 10.556-10.74 0-.726-.077-1.282-.175-1.69h-10.38z"
//                   />
//                 </svg>
//                 Continue with Google
//               </button>
//             </div>

//             {/* Sign in redirect */}
//             <p className="text-center text-xs text-purple-950/40 font-medium pt-2">
//               Already have an account?{" "}
//               <Link
//                 to="/sign-in"
//                 className="text-orange-500 font-bold hover:text-purple-900 transition-colors"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default JoinCommunity;
