import React, { useState } from "react";

/* ── Inline SVG Icons ── */

const HelpCircleIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

const TicketIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

/* ── Types ── */

interface SupportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ResourceLink {
  title: string;
  description: string;
  href: string;
}

/* ── Data ── */

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    icon: <MessageIcon />,
    title: "Live Chat",
    description:
      "Chat with our support team in real-time during business hours. Average response time is under 2 minutes.",
    action: "Start Chat",
    href: "#",
  },
  {
    icon: <TicketIcon />,
    title: "Submit a Ticket",
    description:
      "Open a support ticket for non-urgent requests and we'll get back to you within 24 hours on business days.",
    action: "Create Ticket",
    href: "#",
  },
  {
    icon: <HelpCircleIcon />,
    title: "FAQs & Guides",
    description:
      "Browse our comprehensive library of frequently asked questions and step-by-step guides to find answers quickly.",
    action: "Browse FAQs",
    href: "#faqs",
  },
];

const FAQS: FaqItem[] = [
  {
    question: "How do I join the iLEAD ecosystem?",
    answer:
      "Simply head over to our Join Community page and create an account. You can sign up as an individual looking to grow your skills, or as a contributor ready to share your expertise. Once registered, you'll gain immediate access to our mentorship tracks, workshops, and peer network.",
  },
  {
    question: "Is there any cost to participate?",
    answer:
      "iLEAD is built on a selfless giving model — core participation is completely free. Our equipment fund, mentorship hours, and community resources are sustained through voluntary contributions from members who have the capacity to give back. There are no mandatory fees.",
  },
  {
    question: "What types of mentorship programs are available?",
    answer:
      "We offer three primary tracks: Tech Mentorship (software engineering, DevOps, data science), Business Strategy (SME growth, financial planning, market positioning), and Cross-Class Peer Exchange (mutual skill-sharing between professionals at different career stages). Each track pairs you with a mentor matched to your goals.",
  },
  {
    question: "How can I contribute as a mentor or volunteer?",
    answer:
      "If you'd like to give back, select 'Join as Contributor' during registration. You can offer mentorship hours, donate to the Selfless Circle Equipment Fund, lead workshops, or share resources through our iShare knowledge archive. Every contribution, big or small, strengthens the ecosystem.",
  },
  {
    question: "How do I access the iShare knowledge archives?",
    answer:
      "Once you're a registered member, the iShare archives are available from your dashboard. You'll find a curated collection of workshop recordings, technical guides, business templates, and community-authored articles — all free to access and download.",
  },
  {
    question: "What if I need technical support or have a complaint?",
    answer:
      "You can reach our support team via live chat, submit a detailed ticket, or email us directly at support@ileadinitiative.com. We aim to acknowledge all inquiries within 2 hours and resolve most issues within one business day.",
  },
];

const RESOURCES: ResourceLink[] = [
  {
    title: "Getting Started Guide",
    description:
      "A step-by-step walkthrough of the iLEAD platform, from account creation to your first mentorship session.",
    href: "#",
  },
  {
    title: "Community Guidelines",
    description:
      "Our honor code and best practices for fostering a respectful, supportive, and productive environment for all members.",
    href: "#",
  },
  {
    title: "Platform Tutorials",
    description:
      "Video walkthroughs covering everything from scheduling sessions to contributing to the iShare archive.",
    href: "#",
  },
  {
    title: "Privacy & Security",
    description:
      "Learn how we protect your data and what measures we take to ensure a safe experience across the ecosystem.",
    href: "#",
  },
];

/* ── Component ── */

const HelpAndSupport: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="w-full bg-white pt-16">
      {/* ── Hero Header ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 md:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 mb-6 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            We're Here to Help
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-purple-950 mb-4">
            Help & <span className="text-orange-500">Support</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
            Find answers, browse guides, or get in touch with our team. We are
            committed to ensuring every member of the iLEAD ecosystem feels
            supported and empowered.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-purple-950/30">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers, guides, or topics..."
              className="w-full bg-purple-50/30 border border-purple-100 rounded-2xl pl-12 pr-6 py-4 text-sm text-purple-950 placeholder-purple-950/30 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
            />
          </div>
        </div>
      </section>

      {/* ── Support Options Cards ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SUPPORT_OPTIONS.map((option, index) => (
            <a
              key={index}
              href={option.href}
              className="group bg-white border border-purple-950/5 rounded-[2rem] p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/10 hover:border-orange-500/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                {option.icon}
              </div>
              <h3 className="text-xl font-black text-purple-950 mb-3 group-hover:text-orange-500 transition-colors duration-200">
                {option.title}
              </h3>
              <p className="text-sm text-purple-950/60 font-medium leading-relaxed mb-6 flex-1">
                {option.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:text-purple-700 transition-colors duration-200">
                {option.action}
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faqs" className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 mb-4">
              Frequently Asked{" "}
              <span className="text-orange-500">Questions</span>
            </h2>
            <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about the iLEAD ecosystem. Can't find
              what you're looking for? Reach out to our support team.
            </p>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-purple-950/5 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-950/5"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-6 md:px-8 py-5 text-left cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-bold text-purple-950 pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-950/40 transition-all duration-300 ${
                        openFaqIndex === index
                          ? "bg-orange-500 text-white rotate-180"
                          : "group-hover:bg-purple-100"
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openFaqIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-5 pt-0">
                      <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-950/30 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon />
                </div>
                <p className="text-base font-bold text-purple-950 mb-1">
                  No results found
                </p>
                <p className="text-sm text-purple-950/50 font-medium">
                  Try adjusting your search terms or browse all FAQs above.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Knowledge Base / Resources ── */}
      <section className="bg-purple-50/30 border-t border-purple-100/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 mb-4">
              Knowledge <span className="text-orange-500">Base</span>
            </h2>
            <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed max-w-2xl mx-auto">
              Explore our library of resources designed to help you make the
              most of the iLEAD ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {RESOURCES.map((resource, index) => (
              <a
                key={index}
                href={resource.href}
                className="group bg-white border border-purple-950/5 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/10 hover:border-orange-500/20"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <BookIcon />
                </div>
                <h3 className="text-base font-black text-purple-950 mb-2 group-hover:text-orange-500 transition-colors duration-200">
                  {resource.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-4">
                  {resource.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 group-hover:text-purple-700 transition-colors duration-200">
                  Read More
                  <ExternalLinkIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Still Need Help? CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="bg-purple-950 rounded-[2.5rem] px-8 py-16 md:py-20 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-950/20">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-purple-900/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6">
              Still Need <span className="text-orange-400">Help?</span>
            </h2>
            <p className="text-base sm:text-lg text-purple-100/80 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
              Our support team is standing by to assist you. Whether you have a
              technical issue, a question about membership, or just want to say
              hello — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@ileadinitiative.com"
                className="w-full sm:w-auto bg-orange-500 hover:bg-white hover:text-purple-950 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 cursor-pointer text-base whitespace-nowrap inline-block text-center"
              >
                Contact Support
              </a>
              <a
                href="mailto:hello@ileadinitiative.com"
                className="w-full sm:w-auto bg-transparent text-white border-2 border-purple-400/30 hover:border-white hover:bg-white/10 font-bold px-10 py-4 rounded-xl transition-all duration-300 cursor-pointer text-base whitespace-nowrap inline-block text-center"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HelpAndSupport;
