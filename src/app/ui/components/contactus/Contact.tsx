import React, { useState } from "react";

const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      label: "Email Us",
      value: "hello@ileadinitiative.org",
      href: "mailto:hello@ileadinitiative.org",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      label: "Our Location",
      value: "Lagos, Nigeria — Global Operations",
      href: null,
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "Response Time",
      value: "We reply within 24–48 hours",
      href: null,
    },
  ];

  const faqItems = [
    {
      question: "How can I join the iLEAD mentorship program?",
      answer:
        "Navigate to the 'Join the Ecosystem' section on our homepage or visit the membership page to submit your application. Our team reviews applications and matches you with a mentor aligned with your goals.",
    },
    {
      question: "Do you offer support for hardware or equipment funding?",
      answer:
        "Yes. Through our Equipment Fund initiative, qualified members can apply for zero-interest hardware assets and micro-financing. Reach out to us directly or apply via your member dashboard.",
    },
    {
      question: "Can organizations partner with iLEAD?",
      answer:
        "Absolutely. We actively collaborate with educational institutions, tech hubs, and community organizations. Send us a message detailing your proposal and we'll schedule a discovery call.",
    },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear field error on change
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
    // Dismiss success banner when user starts editing again
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      fullName?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Simulate successful submission
    setSubmitted(true);
    setFormData({ fullName: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* SECTION 1: HERO STRATEGIC HEADER */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Let's build something{" "}
              <span className="text-orange-500">meaningful</span> together.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-14">
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed">
              Whether you have a question about mentorship, partnerships, or
              simply want to connect — our team is ready to help you take the
              next step.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTACT METHODS GRID */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="bg-slate-50/50 border border-purple-950/[0.02] rounded-2xl p-6 sm:p-8 space-y-4 hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white border border-purple-950/5 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                {method.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black tracking-tight text-purple-950">
                  {method.label}
                </h4>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-xs sm:text-sm font-semibold text-purple-950/70 hover:text-orange-500 transition-colors duration-200 leading-relaxed"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm font-semibold text-purple-950/70 leading-relaxed">
                    {method.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CONTACT FORM + INFO SIDEBAR */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* FORM COLUMN */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-purple-950">
                  Send us a message
                </h3>
                <p className="text-xs sm:text-sm text-purple-950/60 font-semibold leading-relaxed">
                  Fill out the form below and a member of our team will respond
                  within 48 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success banner */}
                {submitted && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-emerald-800">
                        Message sent successfully!
                      </p>
                      <p className="text-xs font-semibold text-emerald-700/70">
                        Thank you for reaching out. Our team will respond within
                        24–48 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.fullName
                          ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                          : "border-purple-950/10 focus:ring-orange-500/30 focus:border-orange-500/50"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.email
                          ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                          : "border-purple-950/10 focus:ring-orange-500/30 focus:border-orange-500/50"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                      errors.subject
                        ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                        : "border-purple-950/10 focus:ring-orange-500/30 focus:border-orange-500/50"
                    }`}
                  >
                    <option value="">Select a topic</option>
                    <option value="mentorship">Mentorship Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="equipment-fund">Equipment Fund</option>
                    <option value="support">Technical Support</option>
                    <option value="general">General Question</option>
                  </select>
                  {errors.subject && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      <svg
                        className="w-3 h-3 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-[11px] font-black text-purple-950 uppercase tracking-wider"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:ring-2 transition-all duration-200 resize-y ${
                      errors.message
                        ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                        : "border-purple-950/10 focus:ring-orange-500/30 focus:border-orange-500/50"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      <svg
                        className="w-3 h-3 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-orange-500 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20 cursor-pointer text-base"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick connect card */}
            <div className="bg-purple-950 text-white rounded-[2rem] p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-xl shadow-purple-950/10">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-900/40 blur-3xl pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Quick Response
                </span>
                <h4 className="text-lg font-black tracking-tight">
                  Prefer a direct channel?
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
                  For urgent inquiries, reach our coordination team directly.
                </p>
              </div>

              <div className="space-y-3.5 relative z-10">
                <a
                  href="mailto:hello@ileadinitiative.org"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-all duration-200 group"
                >
                  <svg
                    className="w-4 h-4 text-orange-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                    hello@ileadinitiative.com
                  </span>
                </a>

                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <svg
                    className="w-4 h-4 text-orange-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-white/80">
                    Response within 24–48 hours
                  </span>
                </div>
              </div>

              {/* Social row */}
              <div className="pt-3 border-t border-white/10 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-3">
                  Follow our impact
                </span>
                <div className="flex gap-2.5">
                  <a
                    href="https://x.com/ileadinitiative"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 text-white/60 hover:text-white flex items-center justify-center font-bold text-xs transition-all duration-200"
                  >
                    𝕏
                  </a>
                  <a
                    href="https://linkedin.com/in/ileadinitiative"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 text-white/60 hover:text-white flex items-center justify-center font-bold text-xs transition-all duration-200"
                  >
                    in
                  </a>
                  <a
                    href="https://instagram.com/ileadinitiative"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 text-white/60 hover:text-white flex items-center justify-center font-bold text-xs transition-all duration-200"
                  >
                    IG
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ teaser card */}
            <div className="bg-orange-50/40 border border-orange-200/40 rounded-[2rem] p-6 sm:p-8 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-950/[0.01] rounded-bl-full pointer-events-none" />
              <div className="space-y-2">
                <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest">
                  Frequently Asked
                </span>
                <h4 className="text-lg font-black tracking-tight text-purple-950">
                  Quick answers
                </h4>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <details key={idx} className="group">
                    <summary className="list-none flex items-start gap-3 cursor-pointer">
                      <span className="text-orange-500 font-black text-sm mt-0.5 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1.5">
                        <span className="text-xs sm:text-sm font-black text-purple-950 group-open:text-orange-500 transition-colors duration-200">
                          {item.question}
                        </span>
                        <p className="text-xs font-semibold text-purple-950/60 leading-relaxed hidden group-open:block">
                          {item.answer}
                        </p>
                      </div>
                    </summary>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA BANNER */}
      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="w-full bg-purple-950 px-6 py-16 md:py-20 rounded-[2.5rem] text-center text-white relative overflow-hidden shadow-2xl shadow-purple-950/20">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-purple-900/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6">
              Ready to make an <span className="text-orange-500">impact</span>?
            </h2>
            <p className="text-base sm:text-lg text-purple-100/80 font-medium max-w-2xl leading-relaxed mb-10">
              Join a community of builders, mentors, and change-makers working
              together to bridge talent gaps across Africa and beyond.
            </p>
            <a
              href="/join-our-community"
              className="bg-orange-500 hover:bg-white hover:text-purple-950 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 cursor-pointer text-base whitespace-nowrap"
            >
              Join the Ecosystem
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
