import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsLoggedIn,
  logoutUser,
} from "../../redux/slices/Userslice";
import type { AppDispatch } from "../../redux/store";
import NotificationCenter from "./NotificationCenter";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux auth state
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Derive a short greeting name: first word of displayName, or email prefix
  const greetingName = user?.displayName
    ? user.displayName.split(" ")[0]
    : (user?.email?.split("@")[0] ?? "there");

  // Local UI state
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        const clickedToggle = (target as HTMLElement).closest(
          ".mobile-toggle-btn",
        );
        if (!clickedToggle) {
          setIsMobileMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    closeAllMenus();
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm shadow-purple-500/5">
      <nav className="flex justify-between items-center px-6 py-4 md:px-12 max-w-7xl mx-auto">
        {/* Logo Area */}
        <Link
          to="/"
          onClick={closeAllMenus}
          className="font-black text-2xl tracking-tight text-purple-900 hover:text-purple-700 transition-colors flex items-center gap-1.5"
        >
          iLEAD{" "}
          <span className="text-orange-500 text-sm font-bold tracking-wider uppercase bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
            Initiative
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/iShare"
            className="text-sm font-semibold text-purple-950/60 hover:text-purple-900 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            iShare
          </Link>
          <Link
            to="/iTrain"
            className="text-sm font-semibold text-purple-950/60 hover:text-purple-900 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            iTrain
          </Link>

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="text-sm font-semibold text-purple-950/60 hover:text-purple-900 transition-colors flex items-center gap-1 cursor-pointer group focus:outline-none"
            >
              <span>More</span>
              <svg
                className={`w-4 h-4 text-purple-950/40 group-hover:text-purple-900 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 mt-3 w-48 rounded-xl bg-white border border-orange-100 shadow-xl shadow-purple-950/5 py-2 z-50">
                <Link
                  to="/all-causes"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 text-sm font-medium text-purple-950/70 hover:text-purple-900 hover:bg-orange-50/60 transition-colors"
                >
                  All Campaigns
                </Link>
                <Link
                  to="/about-ilead"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 text-sm font-medium text-purple-950/70 hover:text-purple-900 hover:bg-orange-50/60 transition-colors"
                >
                  About Ilead
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 text-sm font-medium text-purple-950/70 hover:text-purple-900 hover:bg-orange-50/60 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-and-conditions"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 text-sm font-medium text-purple-950/70 hover:text-purple-900 hover:bg-orange-50/60 transition-colors"
                >
                  Terms and Conditions
                </Link>
                <Link
                  to="/contact"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 text-sm font-medium text-purple-950/70 hover:text-purple-900 hover:bg-orange-50/60 transition-colors"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* ── CTA: "Join our Community" OR "Welcome, [Name]" ── */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-purple-950 tracking-wide">
                Welcome, <span className="text-orange-500">{greetingName}</span>
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                closeAllMenus();
                navigate("/join-our-community");
              }}
              className="hidden sm:inline-block bg-orange-500 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20"
            >
              Join our Community
            </button>
          )}

          {/* Profile Dropdown */}
          {isLoggedIn && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full border border-orange-100 bg-white hover:bg-orange-50 transition-colors shadow-sm cursor-pointer overflow-hidden"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-5 h-5 text-purple-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                    />
                  </svg>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white border border-orange-100 shadow-xl shadow-purple-950/10 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-100">
                    {isLoggedIn ? (
                      <>
                        <p className="font-bold text-purple-950">
                          {user?.displayName ?? "Community Member"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-purple-950">
                          Not signed in
                        </p>
                        <p className="text-xs text-gray-500">
                          Join the iLEAD ecosystem
                        </p>
                      </>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-contributions"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    My Contributions
                  </Link>
                  <Link
                    to="/saved-campaigns"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    Saved Campaigns
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 text-sm hover:bg-orange-50 transition-colors"
                  >
                    Help & Support
                  </Link>

                  <div className="border-t border-gray-100">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          navigate("/join-our-community");
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-orange-500 font-bold hover:bg-orange-50 transition-colors"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && <NotificationCenter />}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-toggle-btn md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-purple-50 hover:bg-orange-50 text-purple-950 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between relative">
              <span
                className={`w-full h-0.5 bg-purple-950 rounded-sm transition-all duration-300 origin-left ${isMobileMenuOpen ? "rotate-45 translate-x-0.5 -translate-y-0.5" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-purple-950 rounded-sm transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`w-full h-0.5 bg-purple-950 rounded-sm transition-all duration-300 origin-left ${isMobileMenuOpen ? "-rotate-45 translate-x-0.5 translate-y-0.5" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden w-full bg-white border-b border-orange-100 px-6 py-6 flex flex-col gap-4 shadow-xl shadow-purple-950/5"
        >
          <Link
            to="/iShare"
            onClick={closeAllMenus}
            className="text-base font-bold text-purple-950/80 hover:text-purple-900 hover:bg-orange-50/50 px-4 py-2.5 rounded-xl transition-colors"
          >
            iShare
          </Link>
          <Link
            to="/iTrain"
            onClick={closeAllMenus}
            className="text-base font-bold text-purple-950/80 hover:text-purple-900 hover:bg-orange-50/50 px-4 py-2.5 rounded-xl transition-colors"
          >
            iTrain
          </Link>

          <div className="h-px bg-purple-950/5 my-1" />

          <Link
            to="/all-causes"
            onClick={closeAllMenus}
            className="text-sm font-semibold text-purple-950/60 hover:text-purple-900 hover:bg-orange-50/50 px-4 py-2 rounded-xl transition-colors pl-6"
          >
            All Campaigns
          </Link>
          <Link
            to="/contact"
            onClick={closeAllMenus}
            className="text-sm font-semibold text-purple-950/60 hover:text-purple-900 hover:bg-orange-50/50 px-4 py-2 rounded-xl transition-colors pl-6"
          >
            Contact
          </Link>

          {/* Mobile CTA: "Join" OR "Welcome" */}
          {isLoggedIn ? (
            <div className="sm:hidden flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-3 rounded-xl mt-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-purple-950">
                Welcome, <span className="text-orange-500">{greetingName}</span>
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                closeAllMenus();
                navigate("/join-our-community");
              }}
              className="sm:hidden w-full mt-2 bg-orange-500 hover:bg-purple-700 text-white py-3 rounded-xl text-center text-sm font-bold shadow-md transition-all"
            >
              Join our Community
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
