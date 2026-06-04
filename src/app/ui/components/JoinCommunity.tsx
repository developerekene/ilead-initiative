import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  registerWithEmail,
  loginWithGoogle,
  selectUserLoading,
  selectUserError,
  clearError,
} from "../../redux/slices/Userslice";
import type { AppDispatch } from "../../redux/store";

// Eye icons as inline SVG components
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

const JoinCommunity: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isLoading = useSelector(selectUserLoading);
  const authError = useSelector(selectUserError);

  const [accountType, setAccountType] = useState<"contributor" | "individual">(
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
  const [localError, setLocalError] = useState<string | null>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalError(null);
    dispatch(clearError());
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!acceptTerms) {
      setLocalError("Please accept the terms and conditions to continue.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const result = await dispatch(
      registerWithEmail({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }),
    );

    if (registerWithEmail.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignUp = async () => {
    setLocalError(null);
    dispatch(clearError());

    const result = await dispatch(loginWithGoogle());

    if (loginWithGoogle.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const displayError = localError || authError;

  return (
    <section className="w-full min-h-screen bg-slate-50/50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-12">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-xl shadow-purple-950/5 border border-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        {/* Left Panel */}
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
                alt="Cross-functional collaboration"
                className="max-w-full h-auto rounded-2xl mx-auto object-cover"
              />
              <figcaption className="mt-3 text-xs text-purple-300/60 font-medium tracking-wide">
                Human-centric tech collaboration
              </figcaption>
            </figure>
          </div>
          <div className="text-xs text-purple-300/60 font-medium">
            "I am because We are" - Stronger Together
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-purple-950 tracking-tight">
              Create your Account
            </h3>
            <p className="text-sm text-purple-950/50 font-medium mt-1">
              Join a borderless ecosystem of developers and product creators.
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="mb-8">
            <label className="text-xs font-black uppercase tracking-widest text-purple-950/40 block mb-3">
              Select Workflow Track
            </label>
            <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 rounded-2xl border border-purple-950/[0.03]">
              <button
                type="button"
                onClick={() => setAccountType("individual")}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  accountType === "individual"
                    ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
                    : "text-purple-950/50 hover:text-purple-950"
                }`}
              >
                Join as Individual
              </button>
              <button
                type="button"
                onClick={() => setAccountType("contributor")}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  accountType === "contributor"
                    ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
                    : "text-purple-950/50 hover:text-purple-950"
                }`}
              >
                Join as Contributor
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Ekene"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Okoli"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>
            </div>

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

            {/* Password fields with eye toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Password
                </label>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 pr-11 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-950/30 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Toggle */}
            <div className="pt-2 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-purple-950/[0.02]">
              <span className="text-xs sm:text-sm font-semibold text-purple-950/70 pl-1">
                Accept our{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-purple-900 underline hover:text-orange-500 font-bold transition-colors"
                >
                  terms and conditions
                </Link>
              </span>
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                  acceptTerms ? "bg-orange-500" : "bg-slate-300"
                }`}
                aria-label="Toggle acceptance of terms"
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    acceptTerms ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
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
                    Creating Account...
                  </>
                ) : (
                  "Join Community"
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
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

            {/* Sign in redirect */}
            <p className="text-center text-xs text-purple-950/40 font-medium pt-2">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-orange-500 font-bold hover:text-purple-900 transition-colors"
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
//         {/* Left Panel — unchanged */}
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
//                   placeholder="Okonkwo"
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

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="••••••••"
//                   className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-1">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   placeholder="••••••••"
//                   className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
//                 />
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
