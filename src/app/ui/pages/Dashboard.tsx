import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectProfileComplete,
} from "../../redux/slices/User";
import { RootState } from "../../redux/store";

interface SidebarGroup {
  title: string;
  icon: string;
  items: { label: string; path: string }[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const profileComplete = useSelector(selectProfileComplete);

  // Safely grab user details from Redux store for the header card
  const user = useSelector((state: RootState) => state.user);
  
  // Guard clause hooks
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in", { replace: true });
      return;
    }
    if (!profileComplete) {
      navigate("/complete-profile", { replace: true });
    }
  }, [isLoggedIn, profileComplete, navigate]);

  // Track which sidebar sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "My Workspace": true,
    "Community Ecosystem": false,
    "Academic & Mentorship": false,
    "Growth & Media": false,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Structured Sidebar Ecosystem Strategy Groupings
  const sidebarGroups: SidebarGroup[] = [
    {
      title: "My Workspace",
      icon: "💼",
      items: [
        { label: "My Campaigns", path: "/dashboard/campaigns" },
        { label: "My Story", path: "/dashboard/story" },
        { label: "My Ishare Info", path: "/dashboard/ishare" },
        { label: "My iTrain Info", path: "/dashboard/itrain" },
      ],
    },
    {
      title: "Community Ecosystem",
      icon: "🌐",
      items: [
        { label: "Success Stories", path: "/dashboard/success-stories" },
        { label: "Top Communities Givers", path: "/dashboard/top-givers" },
        { label: "Top iNeed Requests", path: "/dashboard/top-requests" },
        { label: "Post a Need / Offer", path: "/dashboard/post-need-offer" },
      ],
    },
    {
      title: "Academic & Mentorship",
      icon: "🎓",
      items: [
        { label: "Find a Mentor", path: "/dashboard/find-mentor" },
        { label: "View All Mentors", path: "/dashboard/all-mentors" },
        { label: "Start a Teaching Block", path: "/dashboard/teaching-block" },
        { label: "CGPA Tracking", path: "/dashboard/cgpa-tracker" },
        { label: "Academic Consultation Intake", path: "/dashboard/consultation" },
      ],
    },
    {
      title: "Growth & Media",
      icon: "🚀",
      items: [
        { label: "Self Study Habits", path: "/dashboard/study-habits" },
        { label: "Video Record Vaults", path: "/dashboard/video-vaults" },
        { label: "Create a Testimonial Video/Post", path: "/dashboard/testimonial" },
        { label: "Share My Story", path: "/dashboard/share-story" },
        { label: "Earn My Certificate", path: "/dashboard/certificate" },
        { label: "Become a Verified Member", path: "/dashboard/verify" },
        { label: "Disability Panel", path: "/dashboard/disability-panel" },
      ],
    },
  ];

  // Mock analytical metric counts associated with number 3 mapping layout
  const statsOverview = [
    { label: "Active Campaigns", value: "3", icon: "🔥", change: "+1 this month" },
    { label: "iShare Transferred", value: "450k", icon: "🔄", change: "Verified" },
    { label: "iTrain Modules Completed", value: "14 / 18", icon: "🧠", change: "82% progress" },
    { label: "Community Giveback Position", value: "Top 5%", icon: "🏆", change: "84 hrs gifted" },
    { label: "Active iNeed Requests", value: "1", icon: "🚨", change: "1 active offer" },
    { label: "Assigned Mentors", value: "2 Leaders", icon: "🤝", change: "Weekly sync active" },
    { label: "Current Current CGPA Metric", value: "3.84", icon: "📈", change: "Last updated today" },
    { label: "Vault Records Streamed", value: "42 Clips", icon: "📹", change: "1.2 GB consumed" },
    { label: "Certification Benchmarks", value: "2 Unlocked", icon: "📜", change: "1 pending review" },
  ];

  if (!isLoggedIn || !profileComplete) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  // Derive explicit fallback dynamic rendering metrics for name values
  const userDisplayName = user?.displayName || `${user?.firstName || "iLead"} ${user?.lastName || "Member"}`.trim();
  const userEmail = user?.email || "member@ilead-ecosystem.org";

  return (
    <div className="w-full min-h-screen bg-slate-50 flex border-t border-purple-950/5">
      
      {/* 2. SIDEBAR NAVIGATION COMPONENT (COLLAPSIBLE SECTION ARCHITECTURE) */}
      <aside className="w-72 bg-white border-r border-purple-950/5 hidden md:flex flex-col shrink-0 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-3">
        <div className="px-3 py-2 text-xs font-black text-purple-950/40 uppercase tracking-widest">
          Ecosystem Directory
        </div>
        
        <nav className="space-y-2 flex-1">
          {sidebarGroups.map((group) => {
            const isOpen = expandedSections[group.title];
            return (
              <div key={group.title} className="border border-purple-950/[0.02] rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleSection(group.title)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-purple-50/40 text-left transition-colors duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm select-none">{group.icon}</span>
                    <span className="text-xs font-black text-purple-950 tracking-tight group-hover:text-orange-500 transition-colors">
                      {group.title}
                    </span>
                  </div>
                  <span className={`text-[10px] text-purple-950/30 transform transition-transform duration-200 ${isOpen ? "rotate-180 text-orange-500" : ""}`}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="p-1.5 bg-white border-t border-purple-950/[0.02] flex flex-col gap-0.5 animate-fadeIn">
                    {group.items.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => navigate(item.path)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-purple-950/70 hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Membership Status Vector Badge */}
        <div className="p-3 bg-gradient-to-br from-purple-950 to-purple-900 rounded-xl text-white text-center shadow-md">
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-400">Account Tier</div>
          <div className="text-xs font-bold mt-0.5">Verified Core Contributor</div>
        </div>
      </aside>

      {/* 3. MAIN WORKSPACE VIEW PANEL */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full overflow-x-hidden">
        
        {/* DEFAULT HEADER: DYNAMIC PROFILE IDENTIFIER AND META GRID */}
        <header className="bg-white border border-purple-950/[0.03] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 pointer-events-none" />
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-purple-950 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-purple-950/10 shrink-0">
              {userDisplayName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight leading-none">
                  Welcome back, {userDisplayName}
                </h1>
                <span className="bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-orange-500 animate-ping" /> Active Session
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950/50 font-medium">
                {userEmail} • Core Development Layer Ecosystem Member
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:self-center">
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/post-need-offer")}
              className="px-4 py-2.5 bg-purple-950 hover:bg-orange-500 text-white font-black text-xs rounded-xl tracking-wide transition-all shadow-md shadow-purple-950/5 cursor-pointer"
            >
              + Post New Offer
            </button>
            <button 
              type="button"
              onClick={() => navigate("/complete-profile")}
              className="px-4 py-2.5 bg-white border border-purple-950/10 hover:bg-slate-50 text-purple-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Edit Profile Parameters
            </button>
          </div>
        </header>

        {/* CENTRAL HIGH-DENSITY ANALYTICAL METRICS GRID COMPONENT */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider pl-0.5">Ecosystem Snapshot</h3>
            <p className="text-xs text-purple-950/40 font-medium mt-0.5">Cross-referenced operational analytics parsed from your active profile components.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {statsOverview.map((stat) => (
              <div 
                key={stat.label} 
                className="bg-white border border-purple-950/[0.03] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-slate-50 border border-purple-950/[0.02] rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:bg-orange-50 transition-colors">
                  {stat.icon}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block truncate">
                    {stat.label}
                  </span>
                  <div className="text-xl font-black text-purple-950 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-orange-500 font-bold bg-orange-50/40 inline-block px-1.5 py-0.5 rounded border border-orange-100/30">
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTEXT INFORMATION INTAKE BANNER NOTICE */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/60 rounded-2xl p-5 flex items-start gap-3 text-xs leading-relaxed font-medium text-purple-950/80">
          <span className="text-base select-none">💡</span>
          <div>
            <strong>Automated Synchronization Log:</strong> Your academic tracking indices, video record vault bandwidth allocation, and community contribution hours are updated dynamically every 24 workflow hours. For immediate manual workspace queries, navigate directly to your corresponding group parameter link in the directory matrix.
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;