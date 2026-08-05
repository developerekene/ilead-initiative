import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { addNotification } from "../../redux/slices/notificationSlice";
import { selectUser } from "../../redux/slices/User";
import {
  FormPanel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormRow,
  FormSection,
  FormActions,
} from "../components/formcomponent/FormComponents";

/* ─── Types ────────────────────────────────────────── */

type EntityType = "Facilitator" | "Sponsor" | "Partner";

interface BaseEntity {
  id: string;
  type: EntityType;
  createdAt: string;
}

interface Facilitator extends BaseEntity {
  type: "Facilitator";
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  bio: string;
  yearsOfExperience: string;
  availability: string;
}

interface Sponsor extends BaseEntity {
  type: "Sponsor";
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  sponsorshipType: string;
  industry: string;
  website: string;
}

interface Partner extends BaseEntity {
  type: "Partner";
  organization: string;
  contactPerson: string;
  email: string;
  partnershipType: string;
  industry: string;
  website: string;
  description: string;
}

type Entity = Facilitator | Sponsor | Partner;

/* ─── localStorage persistence ─────────────────────── */

const STORAGE_KEY = "ilead_partners_sponsors";

const loadEntities = (): Entity[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entity[]) : [];
  } catch {
    return [];
  }
};

const saveEntities = (entities: Entity[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  } catch {
    /* ignore */
  }
};

/* ─── Default form state per type ──────────────────── */

const DEFAULT_FORMS: Record<EntityType, Record<string, string>> = {
  Facilitator: {
    fullName: "",
    email: "",
    organization: "",
    expertise: "",
    bio: "",
    yearsOfExperience: "",
    availability: "",
  },
  Sponsor: {
    organization: "",
    contactPerson: "",
    email: "",
    phone: "",
    sponsorshipType: "",
    industry: "",
    website: "",
  },
  Partner: {
    organization: "",
    contactPerson: "",
    email: "",
    partnershipType: "",
    industry: "",
    website: "",
    description: "",
  },
};

/* ─── Type meta ────────────────────────────────────── */

const TYPE_META: Record<EntityType, { icon: string; color: string }> = {
  Facilitator: {
    icon: "🎓",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Sponsor: {
    icon: "💼",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Partner: {
    icon: "🤝",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

/* ─── Display fields per type ──────────────────────── */

const DISPLAY_FIELDS: Record<EntityType, string[]> = {
  Facilitator: ["fullName", "organization", "expertise", "availability"],
  Sponsor: ["organization", "contactPerson", "industry", "sponsorshipType"],
  Partner: ["organization", "contactPerson", "industry", "partnershipType"],
};

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  organization: "Organization",
  expertise: "Area of Expertise",
  availability: "Availability",
  contactPerson: "Contact Person",
  industry: "Industry",
  sponsorshipType: "Sponsorship Type",
  partnershipType: "Partnership Type",
};

/* ─── Component ────────────────────────────────────── */

const PartnerAndSponsor: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [entities, setEntities] = useState<Entity[]>(loadEntities);
  const [selectedType, setSelectedType] = useState<EntityType>("Facilitator");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    ...DEFAULT_FORMS.Facilitator,
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const filteredEntities = entities.filter((e) => e.type === selectedType);

  const openForm = (type: EntityType) => {
    setSelectedType(type);
    setForm({ ...DEFAULT_FORMS[type] });
    setIsPanelOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const base = {
      id: uuidv4(),
      type: selectedType,
      createdAt: new Date().toISOString(),
    };

    let entity: Entity;
    if (selectedType === "Facilitator") {
      entity = {
        ...base,
        type: "Facilitator",
        fullName: form.fullName,
        email: form.email,
        organization: form.organization,
        expertise: form.expertise,
        bio: form.bio,
        yearsOfExperience: form.yearsOfExperience,
        availability: form.availability,
      } as Facilitator;
    } else if (selectedType === "Sponsor") {
      entity = {
        ...base,
        type: "Sponsor",
        organization: form.organization,
        contactPerson: form.contactPerson,
        email: form.email,
        phone: form.phone,
        sponsorshipType: form.sponsorshipType,
        industry: form.industry,
        website: form.website,
      } as Sponsor;
    } else {
      entity = {
        ...base,
        type: "Partner",
        organization: form.organization,
        contactPerson: form.contactPerson,
        email: form.email,
        partnershipType: form.partnershipType,
        industry: form.industry,
        website: form.website,
        description: form.description,
      } as Partner;
    }

    const updated = [entity, ...entities];
    setEntities(updated);
    saveEntities(updated);

    const name =
      selectedType === "Facilitator"
        ? form.fullName
        : form.organization || form.contactPerson;

    dispatch(
      addNotification({
        id: uuidv4(),
        caseId: entity.id,
        type: "GENERAL",
        title: `${selectedType} Added`,
        message: `${name || selectedType} has been registered as a ${selectedType.toLowerCase()} on the iLEAD platform.`,
        timestamp: new Date().toISOString(),
        isUnread: true,
        senderName: (user as { displayName?: string })?.displayName || "You",
      }),
    );

    toast.success(`${selectedType} added successfully!`);
    setIsSubmitting(false);
    setIsPanelOpen(false);
  };

  const handleRemove = (id: string) => {
    const updated = entities.filter((e) => e.id !== id);
    setEntities(updated);
    saveEntities(updated);
    toast("Entry removed.", { icon: "🗑️" });
  };

  const meta = TYPE_META[selectedType];

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Partners & Sponsors
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              The People Behind{" "}
              <span className="text-orange-500">Our Impact</span>
            </h1>
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-3xl">
              Meet the facilitators, sponsors, and partners powering the iLEAD
              ecosystem. Register an entry to be listed in the community.
            </p>
          </div>
          <div className="lg:col-span-4 lg:pt-14 flex justify-center lg:justify-end">
            <div className="text-center space-y-3">
              <span className="text-4xl font-black text-purple-950 block">
                {entities.length}
              </span>
              <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                Total Entries
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLBAR ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Type dropdown */}
          <div className="relative sm:w-64">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as EntityType)}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="Facilitator">Facilitators</option>
              <option value="Sponsor">Sponsors</option>
              <option value="Partner">Partners</option>
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-950/30">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Add button */}
          <button
            onClick={() => openForm(selectedType)}
            className="inline-flex items-center justify-center gap-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add {selectedType}
          </button>
        </div>
      </section>

      {/* ─── LIST ─── */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-24">
        {filteredEntities.length === 0 ? (
          <div className="bg-slate-50/40 border border-purple-950/[0.02] rounded-[2.5rem] p-16 text-center space-y-4">
            <span className="text-5xl block">{meta.icon}</span>
            <h2 className="text-xl font-black text-purple-950 tracking-tight">
              No {selectedType.toLowerCase()}s listed yet
            </h2>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              Click "Add {selectedType}" to register the first one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map((entity) => (
              <div
                key={entity.id}
                className="group bg-white border border-purple-950/5 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/20 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${meta.color}`}
                    >
                      {meta.icon} {entity.type}
                    </span>
                    <span className="text-[10px] text-purple-950/30 font-medium">
                      {new Date(entity.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Name / org */}
                  <h3 className="text-lg sm:text-xl font-black text-purple-950 leading-snug mb-4 group-hover:text-purple-700 transition-colors break-words">
                    {entity.type === "Facilitator"
                      ? (entity as Facilitator).fullName
                      : (entity as Sponsor | Partner).organization}
                  </h3>

                  {/* Display fields */}
                  <div className="space-y-2.5 mb-6">
                    {DISPLAY_FIELDS[entity.type].map((field) => {
                      const value = entity[field as keyof Entity] as string;
                      if (!value) return null;
                      return (
                        <div key={field as string}>
                          <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                            {FIELD_LABELS[field as string]}
                          </span>
                          <span className="text-xs font-semibold text-purple-950/70 block mt-0.5">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(entity.id)}
                  className="w-full bg-white border border-purple-950/10 hover:border-red-300 hover:bg-red-50 text-purple-950/50 hover:text-red-600 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── SIDE DRAWER FORM ─── */}
      <FormPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title={`Add ${selectedType}`}
        badge={`${meta.icon} ${selectedType}`}
        badgeVariant="orange"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedType === "Facilitator" && (
            <>
              <FormSection title="Personal Details">
                <FormRow cols={2}>
                  <FormInput
                    label="Full Name"
                    required
                    placeholder="e.g. Ekene Okoli"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </FormRow>
                <FormRow cols={2}>
                  <FormInput
                    label="Organization"
                    placeholder="Company or institution"
                    value={form.organization}
                    onChange={(e) => set("organization", e.target.value)}
                  />
                  <FormInput
                    label="Years of Experience"
                    placeholder="e.g. 5 years"
                    value={form.yearsOfExperience}
                    onChange={(e) => set("yearsOfExperience", e.target.value)}
                  />
                </FormRow>
                <FormSelect
                  label="Area of Expertise"
                  required
                  value={form.expertise}
                  onChange={(e) => set("expertise", e.target.value)}
                  options={[
                    { value: "", label: "Select expertise" },
                    {
                      value: "Software Engineering",
                      label: "Software Engineering",
                    },
                    { value: "Product Design", label: "Product Design" },
                    { value: "Business Strategy", label: "Business Strategy" },
                    { value: "Education", label: "Education" },
                    { value: "Digital Marketing", label: "Digital Marketing" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <FormSelect
                  label="Availability"
                  value={form.availability}
                  onChange={(e) => set("availability", e.target.value)}
                  options={[
                    { value: "", label: "Select availability" },
                    { value: "Available", label: "Available" },
                    { value: "Limited", label: "Limited" },
                    { value: "Not available", label: "Not available" },
                  ]}
                />
              </FormSection>
              <FormSection title="About">
                <FormTextarea
                  label="Bio"
                  required
                  rows={4}
                  placeholder="Tell the community about yourself and what you offer..."
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                />
              </FormSection>
            </>
          )}

          {selectedType === "Sponsor" && (
            <>
              <FormSection title="Organization Details">
                <FormRow cols={2}>
                  <FormInput
                    label="Organization Name"
                    required
                    placeholder="Company name"
                    value={form.organization}
                    onChange={(e) => set("organization", e.target.value)}
                  />
                  <FormSelect
                    label="Industry"
                    required
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                    options={[
                      { value: "", label: "Select industry" },
                      { value: "Technology", label: "Technology" },
                      { value: "Finance", label: "Finance" },
                      { value: "Education", label: "Education" },
                      { value: "Healthcare", label: "Healthcare" },
                      { value: "Media", label: "Media" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </FormRow>
                <FormInput
                  label="Website"
                  placeholder="https://example.com"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </FormSection>
              <FormSection title="Contact Person">
                <FormRow cols={2}>
                  <FormInput
                    label="Contact Person"
                    required
                    placeholder="Full name"
                    value={form.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                  />
                  <FormInput
                    label="Phone"
                    placeholder="+234..."
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </FormRow>
                <FormInput
                  label="Email"
                  type="email"
                  required
                  placeholder="sponsor@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </FormSection>
              <FormSection title="Sponsorship">
                <FormSelect
                  label="Sponsorship Type"
                  required
                  value={form.sponsorshipType}
                  onChange={(e) => set("sponsorshipType", e.target.value)}
                  options={[
                    { value: "", label: "Select type" },
                    { value: "Financial", label: "Financial" },
                    { value: "In-kind", label: "In-kind" },
                    { value: "Equipment", label: "Equipment" },
                    { value: "Media", label: "Media" },
                    { value: "Event", label: "Event" },
                  ]}
                />
              </FormSection>
            </>
          )}

          {selectedType === "Partner" && (
            <>
              <FormSection title="Organization Details">
                <FormRow cols={2}>
                  <FormInput
                    label="Organization Name"
                    required
                    placeholder="Company name"
                    value={form.organization}
                    onChange={(e) => set("organization", e.target.value)}
                  />
                  <FormSelect
                    label="Industry"
                    required
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                    options={[
                      { value: "", label: "Select industry" },
                      { value: "Technology", label: "Technology" },
                      { value: "Finance", label: "Finance" },
                      { value: "Education", label: "Education" },
                      { value: "Non-profit", label: "Non-profit" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </FormRow>
                <FormInput
                  label="Website"
                  placeholder="https://example.com"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </FormSection>
              <FormSection title="Contact Person">
                <FormRow cols={2}>
                  <FormInput
                    label="Contact Person"
                    required
                    placeholder="Full name"
                    value={form.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    required
                    placeholder="partner@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </FormRow>
              </FormSection>
              <FormSection title="Partnership">
                <FormSelect
                  label="Partnership Type"
                  required
                  value={form.partnershipType}
                  onChange={(e) => set("partnershipType", e.target.value)}
                  options={[
                    { value: "", label: "Select type" },
                    { value: "Educational", label: "Educational" },
                    { value: "Corporate", label: "Corporate" },
                    { value: "Community", label: "Community" },
                    { value: "Media", label: "Media" },
                    { value: "Government", label: "Government" },
                  ]}
                />
                <FormTextarea
                  label="About the Partnership"
                  required
                  rows={4}
                  placeholder="Describe the collaboration..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </FormSection>
            </>
          )}

          <FormActions
            onCancel={() => setIsPanelOpen(false)}
            submitLabel={`Add ${selectedType}`}
            isSubmitting={isSubmitting}
            loadingLabel="Adding..."
          />
        </form>
      </FormPanel>
    </div>
  );
};

export default PartnerAndSponsor;
