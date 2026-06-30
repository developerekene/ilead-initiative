import React from "react";

/* Data */

interface Section {
  id: string;
  title: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the iLEAD Initiative platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. We reserve the right to update or modify these terms at any time without prior notice, and your continued use of the platform constitutes acceptance of any changes.",
  },
  {
    id: "membership",
    title: "2. Membership Eligibility",
    content:
      "Membership in the iLEAD ecosystem is open to individuals who are at least 18 years of age. By registering, you represent and warrant that all information you provide is accurate, complete, and current. We reserve the right to suspend or terminate accounts that violate our policies or provide false information.",
  },
  {
    id: "code-of-conduct",
    title: "3. Code of Conduct",
    content:
      "All members are expected to uphold the iLEAD values of selfless giving, mutual elevation, and cross-disciplinary collaboration. Harassment, discrimination, hate speech, or any form of harmful behaviour will not be tolerated. We are committed to providing a safe, inclusive, and respectful environment for all participants regardless of background, identity, or experience level.",
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    content:
      "Content shared within the iLEAD ecosystem, including mentorship materials, workshop resources, and community discussions, is intended for personal and educational use. Members may not reproduce, distribute, or commercialise platform content without explicit written permission from iLEAD Initiative. Members retain ownership of their original contributions but grant iLEAD a non-exclusive license to share them within the community.",
  },
  {
    id: "privacy",
    title: "5. Privacy & Data Protection",
    content:
      "We take your privacy seriously. Personal information collected during registration and platform usage is stored securely and will never be sold to third parties. We use your data solely to facilitate mentorship connections, improve our services, and communicate important updates. You may request deletion of your account and associated data at any time by contacting our support team.",
  },
  {
    id: "mentorship",
    title: "6. Mentorship Guidelines",
    content:
      "Mentorship relationships within iLEAD are built on trust, respect, and mutual commitment. Mentors volunteer their time and expertise to support mentees, and mentees are expected to honour scheduled sessions, prepare adequately, and engage with openness. iLEAD facilitates connections but is not liable for outcomes arising from mentor-mentee interactions. Either party may discontinue the relationship at any time.",
  },
  {
    id: "limitation",
    title: "7. Limitation of Liability",
    content:
      "iLEAD Initiative provides its platform and services on an 'as is' basis. We make no warranties, express or implied, regarding the availability, accuracy, or reliability of the platform. In no event shall iLEAD Initiative be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or participation in community activities.",
  },
  {
    id: "termination",
    title: "8. Termination of Access",
    content:
      "We reserve the right to suspend or terminate access to the iLEAD platform at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other members, third parties, or the iLEAD community. Upon termination, your right to use the platform immediately ceases, and any data associated with your account may be deleted.",
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with applicable international laws. Any disputes arising from these terms shall be resolved through amicable negotiation before pursuing any legal remedies. By using iLEAD, you consent to the exclusive jurisdiction of the courts in the relevant jurisdiction.",
  },
  {
    id: "contact",
    title: "10. Contact Information",
    content:
      "If you have any questions, concerns, or requests regarding these Terms and Conditions, please reach out to our team. We value transparency and are happy to clarify any aspect of our policies. You can contact us via email at hello@ileadinitiative.org or through the contact form on our website.",
  },
];

/* Component */

const TermsAndCondition: React.FC = () => {
  return (
    <main className="w-full bg-white-500">
      {/* HERO HEADER */}
      <section className="relative pt-16 pb-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 mb-8 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Legal & Policies
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-purple-950 leading-[1.12] mb-6">
            Terms & <span className="text-orange-500">Conditions</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-purple-950/60 font-medium max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using the iLEAD Initiative
            platform. By participating in our ecosystem, you agree to uphold the
            values and guidelines outlined below.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-purple-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
            Last updated: June 29, 2026
          </div>
        </div>
      </section>

      {/*  TERMS CONTENT */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-xl shadow-purple-950/5">
          {/* Quick navigation */}
          <div className="mb-12 pb-10 border-b border-purple-950/5">
            <h2 className="text-sm font-bold text-purple-950 uppercase tracking-wider mb-5">
              On this page
            </h2>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm font-semibold text-purple-950/60 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-300 group-hover:bg-orange-500 transition-colors duration-200 flex-shrink-0" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 mb-4 leading-snug">
                  {section.title}
                </h3>
                <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-10 border-t border-purple-950/5 text-center">
            <p className="text-sm text-purple-950/40 font-medium leading-relaxed max-w-2xl mx-auto">
              These Terms and Conditions were created to protect both the iLEAD
              community and its members. If you have any questions, please don't
              hesitate to{" "}
              <a
                href="#"
                className="text-orange-500 hover:text-purple-700 font-bold underline transition-colors"
              >
                reach out to us
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndCondition;
