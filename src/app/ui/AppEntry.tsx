import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import Footer from "./components/Footer";
import JoinCommunity from "./components/JoinCommunity";
import Navbar from "./components/Navbar";
import HomeView from "./pages/HomeView";
import ScrollToTop from "./components/others/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import IShareView from "./pages/IShareView";
import ITrainView from "./pages/ITrainView";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundView />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: "join-our-community",
        element: <JoinCommunity />,
      },
      {
        path: "iShare",
        element: <IShareView />
      },
      {
        path: "iTrain",
        element: <ITrainView />
      }
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
]);

export default function AppEntry() {
  return <RouterProvider router={router} />;
}
