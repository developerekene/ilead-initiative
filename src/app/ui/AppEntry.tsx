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
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import IShareView from "./pages/IShareView";
import ITrainView from "./pages/ITrainView";

// Full layout — Navbar + Footer (used by all public pages)
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

// App layout — Navbar only, no Footer (used by authenticated/app pages)
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
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
  // Public pages — with Footer
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
        path: "sign-in",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "iShare",
        element: <IShareView />,
      },
      {
        path: "iTrain",
        element: <ITrainView />,
      },
    ],
  },
  // App pages — no Footer
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default function AppEntry() {
  return <RouterProvider router={router} />;
}

// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Outlet,
//   Link,
// } from "react-router-dom";
// import Footer from "./components/Footer";
// import JoinCommunity from "./components/JoinCommunity";
// import Navbar from "./components/Navbar";
// import HomeView from "./pages/HomeView";
// import ScrollToTop from "./components/others/ScrollToTop";
// import Dashboard from "./pages/Dashboard";
// import Login from "./components/Login";

// const RootLayout = () => {
//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <ScrollToTop />
//       <Navbar />
//       {/* Added a top padding of pt-20 to prevent the fixed navbar from overlapping your layout content */}
//       <main className="flex-1 pt-20">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// const NotFoundView = () => (
//   <div className="text-center py-24 px-6">
//     <h1 className="text-6xl font-black text-purple-950">404</h1>
//     <p className="text-purple-950/60 font-medium mt-2">
//       The section you are looking for does not exist.
//     </p>
//     <Link
//       to="/"
//       className="mt-6 inline-block bg-orange-500 hover:bg-purple-900 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
//     >
//       Return Home
//     </Link>
//   </div>
// );

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     errorElement: <NotFoundView />,
//     children: [
//       {
//         index: true,
//         element: <HomeView />,
//       },
//       {
//         path: "join-our-community",
//         element: <JoinCommunity />,
//       },
//       {
//         path: "sign-in",
//         element: <Login />,
//       },
//       {
//         path: "dashboard",
//         element: <Dashboard />,
//       },
//     ],
//   },
//   // {
//   //   path: "dashboard",
//   //   element: <Dashboard />,
//   // },
// ]);

// export default function AppEntry() {
//   return <RouterProvider router={router} />;
// }
