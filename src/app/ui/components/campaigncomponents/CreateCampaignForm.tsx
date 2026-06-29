import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCampaign,
  type Campaign,
} from "../../../redux/slices/campaignSlice";
import { selectUser } from "../../../redux/slices/User";
import { v4 as uuidv4 } from "uuid";
import {
  FormPanel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormRow,
  FormDivider,
  FormClause,
  FormActions,
  FormSection,
} from "../formcomponent/FormComponents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCampaignForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  // 1. Grab the current user from Redux so we know who is creating the campaign
  const user = useSelector(selectUser);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Tech Mentorship" as Campaign["category"],
    description: "",
    metricLabel: "",
    metricValue: "",
    statusBadge: "In Progress",
    longFormBody: "",
    keyDeliverables: [""],
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setDeliverable = (i: number, value: string) =>
    setForm((prev) => {
      const updated = [...prev.keyDeliverables];
      updated[i] = value;
      return { ...prev, keyDeliverables: updated };
    });

  const addDeliverable = () =>
    setForm((prev) => ({
      ...prev,
      keyDeliverables: [...prev.keyDeliverables, ""],
    }));

  const removeDeliverable = (i: number) =>
    setForm((prev) => ({
      ...prev,
      keyDeliverables: prev.keyDeliverables.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      dispatch(
        addCampaign({
          ...form,
          id: uuidv4(),
          keyDeliverables: form.keyDeliverables.filter(Boolean),
          // 2. Attach the user's ID as the creatorId so it shows up in "My Campaigns"
          creatorId: user?.uid || "anonymous",
        } as Campaign & { creatorId?: string }), // Type assertion to satisfy TS temporarily
      );
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Campaign"
      badge="New Initiative"
      badgeVariant="orange"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Basic info */}
        <FormInput
          label="Campaign Title"
          required
          placeholder="e.g., The Developer Resilience Fund"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />

        <FormRow cols={2}>
          <FormSelect
            label="Category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            options={[
              { value: "Tech Mentorship", label: "Tech Mentorship" },
              { value: "Business Strategy", label: "Business Strategy" },
              { value: "Community Giving", label: "Community Giving" },
            ]}
          />
          <FormInput
            label="Status Badge"
            required
            placeholder="e.g., In Progress"
            value={form.statusBadge}
            onChange={(e) => set("statusBadge", e.target.value)}
          />
        </FormRow>

        <FormTextarea
          label="Short Description"
          fieldNote="(card preview)"
          required
          rows={2}
          placeholder="A concise summary shown on the campaign card..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <FormRow cols={2}>
          <FormInput
            label="Metric Label"
            required
            placeholder="e.g., Members Served"
            value={form.metricLabel}
            onChange={(e) => set("metricLabel", e.target.value)}
          />
          <FormInput
            label="Metric Value"
            required
            placeholder="e.g., 200+ Members"
            value={form.metricValue}
            onChange={(e) => set("metricValue", e.target.value)}
          />
        </FormRow>

        <FormDivider label="Detail Page Content" />

        <FormTextarea
          label="Full Campaign Body"
          fieldNote="(detail page)"
          required
          rows={4}
          placeholder="The full operational intent, scope, and vision of this campaign..."
          value={form.longFormBody}
          onChange={(e) => set("longFormBody", e.target.value)}
        />

        {/* Key deliverables — dynamic list, stays outside FormSelect since it's a custom repeater */}
        <FormSection title="Key Deliverables">
          <div className="flex flex-col gap-2">
            {form.keyDeliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Deliverable ${i + 1}`}
                  value={d}
                  onChange={(e) => setDeliverable(i, e.target.value)}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
                {form.keyDeliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(i)}
                    className="w-8 h-8 shrink-0 rounded-full border border-purple-950/10 hover:border-red-400 hover:text-red-400 text-purple-950/30 flex items-center justify-center text-sm transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              className="text-xs font-bold text-purple-700 self-start hover:text-orange-500 transition-colors pt-1"
            >
              + Add another deliverable
            </button>
          </div>
        </FormSection>

        <FormClause
          title="Visibility Notice"
          body="This campaign will be immediately visible to all platform members once launched. Ensure all details are accurate before submitting."
        />

        <FormActions
          onCancel={onClose}
          submitLabel="Launch Campaign"
          isSubmitting={isSubmitting}
          loadingLabel="Launching..."
        />
      </form>
    </FormPanel>
  );
};

export default CreateCampaignForm;
