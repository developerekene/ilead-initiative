import React, { useState } from "react";

/* Inline SVG icons */

const MailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = () => (
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const LocationIcon = () => (
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
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
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
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

/* Types  */

interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

/*  Data  */

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: <MailIcon />,
    title: "Email Us",
    description: "hello@ileadinitiative.com",
    href: "#",
  },
  {
    icon: <PhoneIcon />,
    title: "Call Us",
    description: "+1 (234) 567-890",
    href: "#",
  },
  {
    icon: <LocationIcon />,
    title: "Office Address",
    description: "123 Innovation Drive, Suite 200, Enugu, Nigeria",
    href: "#",
  },
];

const SOCIAL_LINKS = [
  { name: "Facebook", icon: "f", href: "#", color: "hover:bg-orange-500" },
  { name: "X (Twitter)", icon: "𝕏", href: "#", color: "hover:bg-orange-500" },
  { name: "Instagram", icon: "IG", href: "#", color: "hover:bg-orange-500" },
  { name: "LinkedIn", icon: "in", href: "#", color: "hover:bg-orange-500" },
];

/* ── Component ── */

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) e.subject = "Subject is required";
    if (!formData.message.trim()) {
      e.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      e.message = "Message must be at least 10 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    alert(msg);

    setFormData({
      name: "",
      email: "",
      organization: "",
      subject: "",
      message: "",
    });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-5 py-3.5 rounded-xl border ${
      errors[field]
        ? "border-red-300 bg-red-50"
        : "border-purple-100 bg-purple-50/30"
    } text-purple-950 placeholder-purple-950/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200`;

  return (
    <main className="w-full bg-white pt-16">
      {/* ── Contact Form + Info Cards ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-purple-950 mb-4">
            Contact <span className="text-orange-500">us</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium max-w-2xl mx-auto leading-relaxed">
            Give us a call or drop by anytime, we endeavour to answer all
            enquiries within 24 hours on business days. We will be happy to
            answer your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-950/5">
              <h2 className="text-2xl md:text-3xl font-black text-purple-950 mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm md:text-base text-purple-950/60 font-medium mb-8">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-purple-950 mb-2"
                    >
                      Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-semibold mt-1.5">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-purple-950 mb-2"
                    >
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs font-semibold mt-1.5">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-bold text-purple-950 mb-2"
                  >
                    Organization{" "}
                    <span className="text-purple-950/40 font-medium">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className="w-full px-5 py-3.5 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-950 placeholder-purple-950/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-purple-950 mb-2"
                  >
                    Subject <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${inputClass("subject")} appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12`}
                  ></input>
                  {errors.subject && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-purple-950 mb-2"
                  >
                    Message <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className={inputClass("message")}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs font-semibold mt-1.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20 cursor-pointer text-base flex items-center justify-center gap-3"
                >
                  Send Message
                  <ArrowRightIcon />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Contact Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-xl font-black text-purple-950 mb-2 lg:hidden">
              Contact Information
            </h3>
            {CONTACT_INFO.map((info, index) => (
              <a
                key={index}
                href={info.href}
                className="group bg-white border border-purple-950/5 rounded-[2rem] p-6 md:p-8 flex items-start gap-5 shadow-lg shadow-purple-950/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/10 hover:border-orange-500/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  {info.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-purple-950 mb-1 group-hover:text-orange-500 transition-colors duration-200">
                    {info.title}
                  </h4>
                  <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
                    {info.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-950/40 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5">
                  <ArrowRightIcon />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/*   3. LOCATION & SOCIAL SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* ── Left Side: Map ── */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-purple-950/5 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-950/5 hover:shadow-2xl hover:shadow-purple-950/10 transition-all duration-500">
              {/* Embedded Google Map placeholder */}
              <div className="w-full h-[280px] md:h-[340px] bg-purple-50 relative overflow-hidden">
                <iframe
                  title="iLEAD Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0864559614227!2d-122.41941548468155!3d37.77492927975948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c5c0f0c9f%3A0x8c5c0f0c9f0c0f0!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <LocationIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-purple-950 mb-1">
                      Our Office
                    </h4>
                    <p className="text-sm md:text-base text-purple-950/60 font-medium leading-relaxed max-w-md">
                      123 Innovation Drive, Suite 200
                      <br />
                      Enugu, Nigeria
                    </p>
                    <p className="text-sm text-purple-950/40 font-medium mt-3">
                      We're conveniently located in the heart of the city. Reach
                      out before visiting to ensure someone is available to meet
                      with you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Side: Follow Us ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-purple-950/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-purple-950/5 hover:shadow-2xl hover:shadow-purple-950/10 transition-all duration-500 h-full flex flex-col">
              <h3 className="text-2xl font-black text-purple-950 mb-2">
                Follow Us
              </h3>
              <p className="text-sm md:text-base text-purple-950/60 font-medium mb-8 leading-relaxed">
                Stay connected and follow our journey across social media for
                the latest updates, stories, and community highlights.
              </p>

              <div className="flex flex-wrap gap-4 mt-auto">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    title={social.name}
                    className={`w-10 h-10 rounded-full bg-purple-50 text-purple-950 ${social.color} flex items-center justify-center font-bold text-sm transition-all duration-300 hover:text-white hover:scale-110 hover:-rotate-3 `}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-purple-950/5">
                <p className="text-xs font-bold text-purple-950/40 uppercase tracking-wider mb-2">
                  Get in touch
                </p>
                <p className="text-sm font-semibold text-purple-950">
                  hello@ileadinitiative.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
