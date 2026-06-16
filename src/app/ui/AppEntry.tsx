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
import { setUser, clearUser, setProfileComplete } from "../redux/slices/User";
import { SerializedUser } from "../redux/slices/User";
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

//Auth Listener
// Runs once on mount. Waits for Firebase to resolve the session,
// then hydrates Redux from Firestore before ungating the router.
// This eliminates the race condition where routes render before
// isLoggedIn is settled.
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

const ProfileLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <ScrollToTop />
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
      { path: "iTrain", element: <ITrainView /> },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [{ path: "dashboard", element: <Dashboard /> }],
  },
  {
    path: "/",
    element: <ProfileLayout />,
    children: [{ path: "complete-profile", element: <CompleteProfile /> }],
  },
]);

export default function AppEntry() {
  const [authReady, setAuthReady] = useState(false);
  const onReady = React.useCallback(() => setAuthReady(true), []);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}
