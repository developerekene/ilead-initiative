import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectProfileComplete,
} from "../../redux/slices/Userslice";
import SideBar from "../components/dashboard/SideBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const profileComplete = useSelector(selectProfileComplete);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in", { replace: true });
      return;
    }
    if (profileComplete === false) {
      // profileComplete=null means still loading — don't redirect yet
      navigate("/complete-profile", { replace: true });
    }
  }, [isLoggedIn, profileComplete, navigate]);

  // Show spinner while profileComplete is still null (being resolved)
  if (!isLoggedIn || profileComplete === null) {
    return (
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
    );
  }
  return (
    <div>
      <SideBar />
    </div>
  );
};

export default Dashboard;
