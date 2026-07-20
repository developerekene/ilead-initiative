import React, { useState } from "react";
import { Link } from "react-router-dom";

/* Data */

interface HelpCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  topics: string[];
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
    title: "Account & Profile",
    description:
      "Manage your account settings, update your profile, and control your privacy preferences.",
    topics: [
      "How do I update my profile?",
      "Resetting your password",
      "Deactivating your account",
      "Privacy settings explained",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
        />
      </svg>
    ),
    title: "Technical Support",
    description:
      "Troubleshoot platform issues, browser errors, and get help with connectivity.",
    topics: [
      "Platform not loading?",
      "Mobile access issues",
      "Browser compatibility",
      "Error messages explained",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
    ),
    title: "Mentorship Help",
    description:
      "Guidance on mentorship matching, session scheduling, and making the most of your mentorship journey.",
    topics: [
      "How mentorship matching works",
      "Scheduling your first session",
      "Mentor-mentee guidelines",
      "Ending a mentorship relationship",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
        />
      </svg>
    ),
    title: "Community & Giving",
    description:
      "Learn about iSHARE, the Equipment Fund, and how to participate in community initiatives.",
    topics: [
      "What is iSHARE?",
      "Applying for Equipment Fund",
      "How to post a need or offer",
      "Community guidelines",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
        />
      </svg>
    ),
    title: "iTrain & Workshops",
    description:
      "Get help with workshop registrations, video vault access, certificates, and scheduler tools.",
    topics: [
      "Registering for a workshop",
      "Accessing the video vault",
      "Downloading your certificate",
      "Using the workshop scheduler",
    ],
  },
];

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I join the iLEAD ecosystem?",
    answer:
      "Head to the 'Join the Ecosystem' section on our homepage or visit the Membership page. Fill out the registration form with your details, and our onboarding team will review your application. Once approved, you'll gain full access to mentorship matching, community forums, and workshop resources.",
  },
  {
    id: "faq-2",
    question: "Is there a cost to being a member?",
    answer:
      "iLEAD is built on the principle of selfless giving — membership is completely free. We believe access to mentorship, skill-building, and community support should never be blocked by financial barriers. Some optional programs like the Equipment Fund involve transparent administrative reviews, but core membership has zero cost.",
  },
  {
    id: "faq-3",
    question: "How are mentors matched with mentees?",
    answer:
      "Our matching system considers your stated goals, preferred field of interest, experience level, and availability. We aim to pair you with a mentor whose expertise aligns with your growth path. You'll receive a match notification and can accept or request a different pairing if needed.",
  },
  {
    id: "faq-4",
    question: "What should I do if I'm experiencing a technical issue?",
    answer:
      "First, try clearing your browser cache or switching to a modern browser like Chrome or Firefox. If the issue persists, visit our Technical Support category above or reach out directly via the contact form at the bottom of this page. Our support team typically responds within 24 hours.",
  },
  {
    id: "faq-5",
    question: "Can I contribute resources or funding to the community?",
    answer:
      "Absolutely. iLEAD thrives on collective elevation. You can contribute by offering mentorship, posting resources through iSHARE, donating to the Equipment Fund, or volunteering your skills for community projects. Every contribution strengthens the ecosystem for everyone.",
  },
  {
    id: "faq-6",
    question: "How do I update my personal information?",
    answer:
      "Log into your account and navigate to your profile dashboard. From there, you can edit your name, bio, contact details, and professional information. Changes are saved instantly. If you run into any issues, our support team is happy to assist.",
  },
];

/* Component */

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Help & Support
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              We're here to{" "}
              <span className="text-orange-500">help you grow</span>.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
              Whether you're troubleshooting a technical issue, navigating
              mentorship, or just getting started — find the answers you need,
              right here.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black text-purple-950/40 uppercase tracking-widest">
            Browse by Topic
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950">
            How can we support you?
          </h2>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            Select a category below to explore common questions and resources
            tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HELP_CATEGORIES.map((category, idx) => (
            <div
              key={idx}
              className="group bg-slate-50/40 border border-purple-950/[0.02] rounded-2xl p-6 sm:p-8 space-y-5 hover:bg-white hover:shadow-md hover:border-purple-950/10 transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div className="w-11 h-11 bg-white border border-purple-950/5 rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:shadow-md group-hover:border-orange-200/50 transition-all duration-300">
                {category.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-base font-black tracking-tight text-purple-950">
                  {category.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Topics list */}
              <ul className="space-y-2 pt-1">
                {category.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300 group-hover:bg-orange-500 transition-colors duration-200 shrink-0 mt-1.5" />
                    <span className="text-xs font-semibold text-purple-950/50 group-hover:text-purple-950/70 transition-colors duration-200">
                      {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 md:mx-8 mb-8 px-6 py-16 md:py-20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl transform translate-x-24 -translate-y-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-700/20 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Quick answers to common questions
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-medium leading-relaxed max-w-xl mx-auto">
              Can't find what you're looking for? Scroll down to reach our
              support team directly.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left"
                  >
                    <span className="text-sm sm:text-base font-bold text-white/90 leading-snug pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 shrink-0 text-orange-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 sm:px-7 pb-5 sm:pb-6">
                      <div className="w-full h-px bg-white/10 mb-4" />
                      <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STILL NEED HELP?  */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Still stuck?
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-purple-950">
              We'd love to hear from you
            </h2>
            <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed max-w-lg mx-auto">
              Our support team is made up of real people who care. Send us a
              message and we'll get back to you within 24–48 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href="mailto:ileadinitiative@gmail.com"
                className="inline-flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-purple-950/20"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Email Support
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-purple-950 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-purple-950/10 transition-all duration-200 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Visit Contact Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
