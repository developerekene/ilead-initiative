import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store";
import Button from "../Button";
import { toast } from "react-hot-toast";

// interface Campaign {
//   id: string;
//   title: string;
//   category: "Tech Mentorship" | "Business Strategy" | "Community Giving";
//   description: string;
//   metricLabel: string;
//   metricValue: string;
//   statusBadge: string;
//   longFormBody: string;
//   keyDeliverables: string[];
// }

// Interface mapping for the new registry logs table
interface SubmissionRecord {
  index: number;
  campaignId: string;
  campaignType: "Participant" | "Contributor";
  firstName: string;
  lastName: string;
  dateRegistered: string;
}

// const ILEAD_CAMPAIGNS: Campaign[] = [
// {
//   id: "you-are-not-alone-2026",
//   title: 'The "You Are Not Alone" Network',
//   category: "Community Giving",
//   description:
//     "Providing proactive professional check-ins, direct technical workspace assistance, and collaborative safety nets for engineers breaking out of extreme isolation.",
//   metricLabel: "Active Peers Connected",
//   metricValue: "850+ Members",
//   statusBadge: "Always Open",
//   longFormBody:
//     "Isolation is one of the silent killers of technical excellence and personal well-being. The 'You Are Not Alone' Network creates a consistent framework of real human validation for software engineers and digital creators. By facilitating weekly mental health check-ins, providing unblocked technical code reviews, and creating shared spaces for safe, unfiltered growth, we establish a robust human foundation beneath technical development layers.",
//   keyDeliverables: [
//     "24/7 technical SOS channel for immediate engineering roadblocks",
//     "Bi-weekly interactive peer circles breaking down developer burnout",
//     "Direct matched mentorship pairing senior engineering leaders with breaking talent",
//   ],
// },
//   {
//     id: "business-bootcamp",
//     title: "SME & Founders Strategic Acceleration",
//     category: "Business Strategy",
//     description:
//       "Breaking down financial planning, scalable team operations, and market positioning for local creators trying to build sustainable businesses.",
//     metricLabel: "Mentorship Hours Gifted",
//     metricValue: "450 hrs",
//     statusBadge: "In Progress",
//     longFormBody:
//       "Great products fail without an equally intentional operational strategy. This sprint focuses purely on grounding local entrepreneurs, creators, and technical solo-founders in sustainable economic realities. We peel back the buzzwords to drill into unit economics, scalable engineering team management, high-impact pipeline growth, and defensible market positioning tailored for sustainable local business longevity.",
//     keyDeliverables: [
//       "1-on-1 financial model mapping and operational overhead diagnostics",
//       "Live pitching, positioning, and service-pricing validation workshops",
//       "Direct access blueprints for hiring and managing remote development teams",
//     ],
//   },
//   {
//     id: "peer-support-fund",
//     title: "The Selfless Circle Equipment Fund",
//     category: "Community Giving",
//     description:
//       "A zero-interest, crowd-fueled collective pool helping community members purchase modern laptops and essential remote working setups.",
//     metricLabel: "Laptops Provided",
//     metricValue: "84 Systems",
//     statusBadge: "Active Support",
//     longFormBody:
//       "Talent is distributed evenly across the globe, but hardware access is not. The Selfless Circle Equipment Fund acts as a community-governed, entirely crowd-funded hardware engine. By eliminating the high capital barriers required to acquire modern development machines, we ensure no advanced learner is locked out of the global digital talent workspace due to broken or outdated computer hardware setup parameters.",
//     keyDeliverables: [
//       "100% zero-interest, community-backed hardware financing loans",
//       "Sourcing and distribution operations for vetted high-spec modern laptops",
//       "Complimentary data allocation and power backup support modules",
//     ],
//   },
// ];

const CampaignDetails: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth and User State Rehydration mapping fields
  const user = useSelector((state: RootState) => state.user);
  const campaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );
  const isUserLoggedIn = user.isLoggedIn;

  // View Panel & Mode Switch Vectors
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<"participant" | "contributor">(
    "participant",
  );
  const campaign = campaigns.find((c) => c.id === campaignId);

  const [PAV, setPAV] = useState("Participate as a Volunteer");
  const [BTI, setBTI] = useState("Back This Initiative");

  // --- SHARED FORM FIELDS ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("");

  // --- UNIQUE PARTICIPANT FIELDS (7 Fields Total) ---
  const [skillsInventory, setSkillsInventory] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("2-5 hours");
  const [participantMotivation, setParticipantMotivation] = useState("");

  // --- UNIQUE CONTRIBUTOR FIELDS (9 Fields Total) ---
  const [contributionType, setContributionType] = useState("Mentorship");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [hasPriorExperience, setHasPriorExperience] = useState("No");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic registry storage state tracking submissions
  const [submittedRecords, setSubmittedRecords] = useState<SubmissionRecord[]>(
    [],
  );

  // Auto hydration block when user state becomes active
  useEffect(() => {
    if (isUserLoggedIn) {
      setFullName(
        user.displayName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      );
      setEmail(user.email || "");
    }
  }, [isUserLoggedIn, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [campaignId]);

  if (!campaign) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-50 border border-purple-950/5 rounded-2xl flex items-center justify-center mb-4 text-purple-950/40 text-xl font-bold">
          🔍
        </div>
        <h2 className="text-xl font-black text-purple-950 tracking-tight">
          Workflow Not Found
        </h2>
        <Link
          to="/campaigns"
          className="bg-purple-950 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all mt-6"
        >
          Return to Active Workflows
        </Link>
      </main>
    );
  }

  const handleParticipant = () => {
    if (isUserLoggedIn) {
      setPAV("Authenticating User...");
      setTimeout(() => {
        setFormMode("participant");
        setIsPanelOpen(true);
        setPAV("Participate as a Volunteer");
      }, 800);
    } else {
      setPAV("Authenticating User...");
      setTimeout(() => {
        navigate("/sign-in", { state: { from: location } });
        toast.error(`Authentication required. Let's sign you in.`, {
          style: { background: "#ff4d4f", color: "#fff" },
        });
        setPAV("Participate as a Volunteer");
      }, 800);
    }
  };

  const handleContributor = () => {
    if (isUserLoggedIn) {
      setBTI("Authenticating User...");
      setTimeout(() => {
        setFormMode("contributor");
        setIsPanelOpen(true);
        setBTI("Back This Initiative");
      }, 800);
    } else {
      setBTI("Authenticating User...");
      setTimeout(() => {
        navigate("/sign-in", { state: { from: location } });
        console.log(location);
        toast.error(`Authentication required. Let's sign you in.`, {
          style: { background: "#ff4d4f", color: "#fff" },
        });
        setBTI("Back This Initiative");
      }, 800);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Capture structural precise submission execution timestamp
    const submissionTimestamp = new Date().toISOString();

    // Structural payload split matching dynamic selection parameters
    const basePayload = {
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      formType: formMode,
      submittedAt: submissionTimestamp,
      applicantIdentity: {
        fullName,
        email,
        phoneNumber,
        timezone,
      },
    };

    const finalPayload =
      formMode === "participant"
        ? {
            ...basePayload,
            applicationDetails: {
              skillsInventory,
              weeklyHours,
              participantMotivation,
            },
          }
        : {
            ...basePayload,
            applicationDetails: {
              contributionType,
              professionalBackground,
              resourceDescription,
              linkedinProfile,
              hasPriorExperience,
            },
          };

    setTimeout(() => {
      console.log("iLEAD Data Engine -> Ingestion complete:", finalPayload);

      // Name parsing setup for regional matrix structure splits
      const nameParts = fullName.trim().split(/\s+/);
      const parsedFirstName = nameParts[0] || "Anonymous";
      const parsedLastName = nameParts.slice(1).join(" ") || "N/A";

      // Instantiating record allocation to append into data table tracking state
      const newRecord: SubmissionRecord = {
        index: submittedRecords.length + 1,
        campaignId: campaign.id,
        campaignType:
          formMode === "participant" ? "Participant" : "Contributor",
        firstName: parsedFirstName,
        lastName: parsedLastName,
        dateRegistered: new Date(submissionTimestamp).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      };

      setSubmittedRecords((prev) => [...prev, newRecord]);

      toast.success(
        `Application logged successfully at ${new Date(submissionTimestamp).toLocaleTimeString()}!`,
        {
          style: { background: "#4BB543", color: "#fff" },
        },
      );

      setIsSubmitting(false);
      setIsPanelOpen(false);
      // Clear conditional inputs
      setParticipantMotivation("");
      setResourceDescription("");
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen text-purple-950 relative overflow-x-hidden">
      <section className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="border-b border-purple-950/5 pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
              {campaign.category}
            </span>
            <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {campaign.statusBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 leading-tight mb-6">
            {campaign.title}
          </h1>
          <p className="text-base sm:text-xl text-purple-950/70 font-medium leading-relaxed max-w-3xl">
            {campaign.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Operational Intent & Scope
              </h3>
              <p className="text-sm sm:text-base text-purple-950/80 font-medium leading-relaxed">
                {campaign.longFormBody}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Core Deliverable Benchmarks
              </h3>
              <ul className="space-y-3.5">
                {campaign.keyDeliverables.map((deliverable, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm sm:text-base text-purple-950/70 font-medium leading-relaxed"
                  >
                    <span className="text-orange-500 mt-1 font-bold select-none text-xs shrink-0 bg-orange-50 border border-orange-100 w-5 h-5 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-purple-950/[0.03] rounded-[2rem] p-6 sm:p-8 space-y-6 lg:sticky lg:top-8 shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 block mb-1">
                {campaign.metricLabel}
              </span>
              <div className="text-3xl font-black text-purple-950 tracking-tight">
                {campaign.metricValue}
              </div>
            </div>

            <div className="border-t border-purple-950/5 pt-6 space-y-4">
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide mb-1.5">
                  Want to support this workflow?
                </h4>
                <p className="text-xs text-purple-950/50 font-medium leading-relaxed">
                  Every active initiative is propelled by shared knowledge, open
                  technical code contributions, hardware sponsorships, and time
                  allocations.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleParticipant}
                  className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-xl text-center text-sm tracking-wide shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {PAV}
                </button>
                <button
                  type="button"
                  onClick={handleContributor}
                  className="w-full bg-white hover:bg-purple-50 border border-purple-950/10 text-purple-950 font-bold py-3.5 px-6 rounded-xl text-center text-sm transition-all duration-200 cursor-pointer"
                >
                  {BTI}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- ADDED: MODIFIED WORKFLOW REGISTRY LOGS TABLE COMPONENT --- */}
        <div className="mt-20 pt-10 border-t border-purple-950/10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-purple-950">
                Active Intake Manifest
              </h3>
              <p className="text-xs text-purple-950/50 font-medium mt-1">
                Real-time operational audit log of submitted applications for
                this campaign block.
              </p>
            </div>
            <span className="inline-flex text-xs font-bold text-purple-950 bg-slate-100 border border-purple-950/5 rounded-lg px-3 py-1.5 self-start sm:self-center">
              Total Records: {submittedRecords.length}
            </span>
          </div>

          {submittedRecords.length === 0 ? (
            <div className="w-full bg-slate-50 border border-dashed border-purple-950/10 rounded-2xl p-8 text-center text-sm text-purple-950/40 font-medium">
              📭 No verified logs recorded for this current view instance.
              Submit your configuration details using the triggers above.
            </div>
          ) : (
            <div className="w-full border border-purple-950/5 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-purple-950 text-white text-[11px] font-black uppercase tracking-wider">
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        Campaign No.
                      </th>
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        Campaign ID
                      </th>
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        Campaign Type
                      </th>
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        First Name
                      </th>
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        Last Name
                      </th>
                      <th className="py-4 px-5 border-b border-purple-950/10">
                        Date Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-purple-950/80 divide-y divide-purple-950/5">
                    {submittedRecords.map((record) => (
                      <tr
                        key={record.index}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-black text-purple-950">
                          #{record.index}
                        </td>
                        <td className="py-3.5 px-5 font-mono text-[11px] text-purple-700/90">
                          {record.campaignId}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                              record.campaignType === "Participant"
                                ? "bg-purple-50 border border-purple-100 text-purple-700"
                                : "bg-orange-50 border border-orange-100 text-orange-600"
                            }`}
                          >
                            {record.campaignType}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-medium">
                          {record.firstName}
                        </td>
                        <td className="py-3.5 px-5 font-medium">
                          {record.lastName}
                        </td>
                        <td className="py-3.5 px-5 text-purple-950/50 font-medium">
                          {record.dateRegistered}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Section Footer Global Nav Pointer Redirects */}
        <div className="text-center mt-16 pt-8 border-t border-purple-950/5">
          <Button
            text="View All Other Campaigns"
            to="/campaigns"
            className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-xl text-center text-sm tracking-wide shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </section>

      {/* Slide-over Right Hand Side Panel Overlay Wrapper Container */}
      <div
        className={`fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm transition-opacity duration-300 ${isPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsPanelOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 h-full bg-white border-l border-purple-950/10 shadow-2xl w-full lg:w-[40%] flex flex-col transform transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Matrix Elements */}
          <div className="p-6 md:p-8 border-b border-purple-950/5 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    formMode === "participant"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {formMode === "participant"
                    ? "Volunteer Intake"
                    : "Strategic Contributor Asset"}
                </span>
              </div>
              <h3 className="text-lg font-black text-purple-950 tracking-tight">
                {formMode === "participant"
                  ? "Volunteer Application Form"
                  : "Initiative Backing Blueprint"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="w-8 h-8 rounded-full bg-white border border-purple-950/10 hover:border-purple-950 text-purple-950 flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Generic Application Form Content Layer */}
          <form
            onSubmit={handleFormSubmit}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5"
          >
            {/* --- REGULAR SHARED FIELDS (Fields 1-4) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Kenny Okoli"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., +44 7123 456789"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Current Timezone / Region
                </label>
                <input
                  type="text"
                  required
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g., London (GMT+1)"
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <hr className="border-purple-950/5 my-2" />

            {/* --- CONDITIONALLY RENDERED PARTICIPANT SPLIT (7 Fields Total) --- */}
            {formMode === "participant" && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Primary Skillsets Inventory (Field 5)
                  </label>
                  <input
                    type="text"
                    required
                    value={skillsInventory}
                    onChange={(e) => setSkillsInventory(e.target.value)}
                    placeholder="e.g., React, TypeScript, Technical Writing"
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Weekly Availability Balance (Field 6)
                  </label>
                  <select
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold cursor-pointer"
                  >
                    <option value="2-5 hours">2 - 5 Hours per week</option>
                    <option value="5-10 hours">5 - 10 Hours per week</option>
                    <option value="10+ hours">
                      10+ Hours (Core Tracker Sync)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Statement of Personal Motivation (Field 7)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={participantMotivation}
                    onChange={(e) => setParticipantMotivation(e.target.value)}
                    placeholder="Why do you wish to join this initiative as an active learner/peer volunteer asset?..."
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* --- CONDITIONALLY RENDERED CONTRIBUTOR SPLIT (9 Fields Total) --- */}
            {formMode === "contributor" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                      Contribution Vector (Field 5)
                    </label>
                    <select
                      value={contributionType}
                      onChange={(e) => setContributionType(e.target.value)}
                      className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold cursor-pointer"
                    >
                      <option value="Mentorship">Technical Mentorship</option>
                      <option value="Hardware">Hardware Sponsorship</option>
                      <option value="Financial">Financial Backing Asset</option>
                      <option value="Infrastructure">
                        Infrastructure Provisioning
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                      Prior Ecosystem Mentorship? (Field 6)
                    </label>
                    <select
                      value={hasPriorExperience}
                      onChange={(e) => setHasPriorExperience(e.target.value)}
                      className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold cursor-pointer"
                    >
                      <option value="No">No, first time backing iLEAD</option>
                      <option value="Yes">
                        Yes, experienced community mentor
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    LinkedIn Profile / Professional Portfolio URL (Field 7)
                  </label>
                  <input
                    type="url"
                    required
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Professional Background Summary (Field 8)
                  </label>
                  <input
                    type="text"
                    required
                    value={professionalBackground}
                    onChange={(e) => setProfessionalBackground(e.target.value)}
                    placeholder="e.g., Senior Software Engineer with 6+ years experience"
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Strategic Asset Breakdown & Resources Offered (Field 9)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    placeholder="Detail the specific scope of assets, workspace knowledge, hours, or materials you wish to gift into this active layer..."
                    className="w-full bg-slate-50 border border-purple-950/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-4 text-xs text-purple-950/80 font-medium leading-relaxed">
              💡 <strong>Operational Intake Clause:</strong> Submitting logs
              your secure session token data alongside a dynamic tracking
              identifier. System organizers will respond directly within 48
              workflow hours.
            </div>

            {/* Bottom Sticky CTA Button Operations Grid */}
            <div className="pt-4 border-t border-purple-950/5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-purple-950/60 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-purple-950 hover:bg-orange-500 text-white font-black py-3.5 px-4 rounded-xl text-center text-sm tracking-wide shadow-md hover:shadow-orange-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    Processing...
                  </>
                ) : formMode === "participant" ? (
                  "Submit Volunteer Profile"
                ) : (
                  "Register Strategic Asset"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
