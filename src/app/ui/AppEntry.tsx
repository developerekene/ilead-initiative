import React, { useEffect, useState, Suspense, lazy } from "react";
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
import { setUser, clearUser, setProfileComplete } from "../redux/slices/User";
import { SerializedUser } from "../redux/slices/User";
import { AppDispatch } from "../redux/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Toaster } from "react-hot-toast";

import SettingsPage from "./pages/SettingsPage";
import ContactUs from "./pages/ContactUs";
import TermsAndCondition from "./pages/TermsAndCondition";
import ISharePostDetails from "./components/ishare/ISharePostDetails";

const Footer = lazy(() => import("./components/Footer"));
const JoinCommunity = lazy(() => import("./components/JoinCommunity"));
const Navbar = lazy(() => import("./components/Navbar"));
const HomeView = lazy(() => import("./pages/HomeView"));
const ScrollToTop = lazy(() => import("./components/others/ScrollToTop"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const IShareView = lazy(() => import("./pages/IShareView"));
const ITrainView = lazy(() => import("./pages/ITrainView"));
const CompleteProfile = lazy(() => import("./components/Completeprofile"));
const CampaignDetails = lazy(
  () => import("./components/campaigncomponents/CampaignDetails"),
);
const AboutUs = lazy(() => import("./pages/AboutUs"));
const CampaignPage = lazy(() => import("./pages/CampaignPage"));
const MembershipPage = lazy(() => import("./pages/MembershipPage"));
const MyCampaignsPage = lazy(() => import("./pages/MyCampaignsPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const HelpAndSupportPage = lazy(() => import("./pages/HelpAndSupportPage"));
const ElectionCampaignDetails = lazy(
  () => import("./components/campaigncomponents/ElectionCampaignDetails"),
);
const NotificationView = lazy(() => import("./components/NotificationView"));

const AuthListener: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to rehydrate full profile from Firestore (handles page refresh)
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));

          if (snap.exists()) {
            const data = snap.data();
            const primary = data?.user?.primaryInformation ?? {};
            const secondary = data?.user?.secondaryInformation ?? {};

            dispatch(
              setUser({
                uid: firebaseUser.uid,
                email: primary.email ?? firebaseUser.email ?? "",
                firstName: primary.firstName ?? "",
                lastName: primary.lastName ?? "",
                displayName:
                  `${primary.firstName ?? ""} ${primary.lastName ?? ""}`.trim() ||
                  firebaseUser.displayName ||
                  "",
                isLoggedIn: true,
                profileComplete: data?.profileComplete ?? false,
                plan: data?.user?.plan ?? "free",
                photoURL: firebaseUser.photoURL ?? null,
              } satisfies Partial<SerializedUser>),
            );
          } else {
            // Firestore doc missing — set minimal identity so guards work
            dispatch(
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? "",
                displayName: firebaseUser.displayName ?? "",
                isLoggedIn: true,
                profileComplete: false,
                plan: "free",
                photoURL: firebaseUser.photoURL ?? null,
              }),
            );
          }
        } catch (err) {
          console.warn("AuthListener: Firestore fetch failed", err);
          // Still mark as logged in with whatever Firebase gave us
          // so the user isn't stuck on a spinner indefinitely
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
              displayName: firebaseUser.displayName ?? "",
              isLoggedIn: true,
              profileComplete: false,
              plan: "free",
              photoURL: firebaseUser.photoURL ?? null,
            }),
          );
        }
      } else {
        //clearUser() not setUser(null) which would break the slice
        dispatch(clearUser());
      }

      // Always ungate the router, even on Firestore failure
      onReady();
    });

    return unsub;
  }, [dispatch, onReady]);

  return null;
};

// This layout contains the Footer and will be used for main public routes
const RootLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Suspense fallback={null}>
      <ScrollToTop />
      <Navbar />
    </Suspense>
    <main className="flex-1 pt-20">
      <Suspense
        fallback={
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </div>
);

const DashboardLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Suspense fallback={null}>
      <ScrollToTop />
      <Navbar />
    </Suspense>
    {/* Added padding to offset the fixed Navbar */}
    <div className="flex-1 pt-20">
      <Suspense
        fallback={
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  </div>
);

const ProfileLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Suspense fallback={null}>
      <ScrollToTop />
    </Suspense>
    <main className="flex-1 pt-20">
      <Suspense
        fallback={
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
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

//Router
const router = createBrowserRouter([
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
      {
        path: "ishare/post/:postId",
        element: <ISharePostDetails />,
      },
      { path: "iTrain", element: <ITrainView /> },
      { path: "about-ilead", element: <AboutUs /> },
      { path: "membership", element: <MembershipPage /> },
      { path: "all-Campaign", element: <CampaignPage /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      {
        path: "all-Campaign/campaign-details/:campaignId",
        element: <CampaignDetails />,
      },
      { path: "settings", element: <SettingsPage /> },
      { path: "contact", element: <ContactUs /> },
      { path: "terms-and-conditions", element: <TermsAndCondition /> },
      { path: "help-and-support", element: <HelpAndSupportPage /> },
      {
        path: "all-Campaign/election-details/:campaignId",
        element: <ElectionCampaignDetails />,
      },
      { path: "notifications", element: <NotificationView /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <NotFoundView />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [{ path: "campaigns", element: <MyCampaignsPage /> }],
      },
    ],
  },
  {
    element: <ProfileLayout />,
    children: [{ path: "complete-profile", element: <CompleteProfile /> }],
  },
]);

export default function AppEntry() {
  const [authReady, setAuthReady] = useState(false);
  const onReady = React.useCallback(() => setAuthReady(true), []);

  return (
    <>
      <Toaster />
      <AuthListener onReady={onReady} />
      {authReady ? (
        <RouterProvider router={router} />
      ) : (
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
    </>
  );
}
