import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { store } from "../redux/store";
import { auth } from "../firebase";
import {
  setUser,
  setProfileComplete,
  SerializedUser,
} from "../redux/slices/Userslice";
import { AppDispatch } from "../redux/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "./components/Footer";
import JoinCommunity from "./components/JoinCommunity";
import Navbar from "./components/Navbar";
import HomeView from "./pages/HomeView";
import ScrollToTop from "./components/others/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import IShareView from "./pages/IShareView";
import ITrainView from "./pages/ITrainView";
import CompleteProfile from "./components/Completeprofile";

// ─── Auth listener ────────────────────────────────────────────────────────────
// Serializes the Firebase User BEFORE it enters Redux so Immer never
// receives a class instance — that was silently breaking state after
// onAuthStateChanged fired post-registration.

// Replace just the AuthListener component in your existing AppEntry.tsx:

const AuthListener: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const serialized: SerializedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };

        // Wrap in try/catch — if Firestore is unreachable (offline, cold
        // start, network blip) we still ungate the router and let the
        // individual route guards handle the null profileComplete state
        let profileComplete: boolean | null = null;
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          profileComplete = snap.exists()
            ? (snap.data()?.profileComplete ?? false)
            : false;
        } catch (err) {
          console.warn("AuthListener: could not fetch profileComplete", err);
          // Leave as null — Dashboard/CompleteProfile spinners will show
          // until the user retries or connectivity is restored
        }

        dispatch(
          setUser({
            user: serialized,
            profileComplete: profileComplete ?? undefined,
          }),
        );
      } else {
        dispatch(setUser(null));
      }

      onReady(); // always ungate the router, even on Firestore failure
    });
    return unsub;
  }, [dispatch, onReady]);

  return null;
};

// ─── Layouts ──────────────────────────────────────────────────────────────────
const RootLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 pt-20">
      <Outlet />
    </main>
  </div>
);

const NotFoundView = () => (
  <div className="text-center py-24 px-6">
    <h1 className="text-6xl font-black text-purple-950">404</h1>
    <p className="text-purple-950/60 font-medium mt-2">
      The section you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="mt-6 inline-block bg-orange-500 hover:bg-purple-900 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
    >
      Return Home
    </Link>
  </div>
);

// ─── Router
const router = createBrowserRouter([
  // Public pages — Navbar + Footer
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundView />,
    children: [
      { index: true, element: <HomeView /> },
      { path: "join-our-community", element: <JoinCommunity /> },
      { path: "sign-in", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "iShare", element: <IShareView /> },
      { path: "iTrain", element: <ITrainView /> },
    ],
  },
  // App pages — Navbar only, no Footer
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "complete-profile", element: <CompleteProfile /> },
    ],
  },
]);

export default function AppEntry() {
  const [authReady, setAuthReady] = useState(false);
  // useCallback ensures AuthListener's useEffect doesn't re-run after
  // authReady flips (onReady reference stays stable across renders)
  const onReady = React.useCallback(() => setAuthReady(true), []);

  return (
    <Provider store={store}>
      {/* AuthListener must be inside Provider so useDispatch works */}
      <AuthListener onReady={onReady} />
      {authReady ? (
        <RouterProvider router={router} />
      ) : (
        // Hold the entire router off-screen until Firebase resolves auth.
        // This guarantees isLoggedIn is settled before any route renders,
        // eliminating the race condition in CompleteProfile's auth guard.
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
          <svg
            className="animate-spin w-8 h-8 text-orange-500"
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
        </div>
      )}
    </Provider>
  );
}
