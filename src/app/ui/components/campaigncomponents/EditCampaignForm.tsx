import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCampaignItem,
  type Campaign,
} from "../../../redux/slices/campaignSlice";
import { selectUser } from "../../../redux/slices/User";
import toast from "react-hot-toast";
import { campaignService } from "../../../redux/configuration/services/campaign.service";
import {
  FormPanel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormRow,
  FormDivider,
  FormActions,
  FormSection,
} from "../formcomponent/FormComponents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignToEdit: Campaign | null;
}

const EditCampaignForm: React.FC<Props> = ({
  isOpen,
  onClose,
  campaignToEdit,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Tech Mentorship" as Campaign["category"],
    description: "",
    statusBadge: "In Progress",
    longFormBody: "",
    keyDeliverables: [""],
  });

  useEffect(() => {
    if (campaignToEdit && isOpen) {
      setForm({
        title: campaignToEdit.title,
        category: campaignToEdit.category,
        description: campaignToEdit.description,
        statusBadge: campaignToEdit.statusBadge,
        longFormBody: campaignToEdit.longFormBody,
        keyDeliverables: campaignToEdit.keyDeliverables?.length
          ? campaignToEdit.keyDeliverables
          : [""],
      });
    }
  }, [campaignToEdit, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !campaignToEdit) return;

    setIsSubmitting(true);

    try {
      const updatedCampaign = {
        ...campaignToEdit,
        ...form,
        keyDeliverables: form.keyDeliverables.filter(Boolean),
      } as Campaign;

      await campaignService.updateCampaign(user.uid, updatedCampaign);
      dispatch(updateCampaignItem(updatedCampaign));

      toast.success("Campaign updated successfully!", {
        style: { background: "#4BB543", color: "#fff" },
      });
      onClose();
    } catch (error) {
      console.error("Failed to update campaign", error);
      toast.error("Failed to update campaign.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Campaign"
      badge="Update"
      badgeVariant="orange"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Campaign Title"
          required
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
            value={form.statusBadge}
            onChange={(e) => set("statusBadge", e.target.value)}
          />
        </FormRow>

        <FormTextarea
          label="Short Description"
          required
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <FormDivider label="Detail Page Content" />

        <FormTextarea
          label="Full Campaign Body"
          required
          rows={4}
          value={form.longFormBody}
          onChange={(e) => set("longFormBody", e.target.value)}
        />

        <FormSection title="Key Deliverables">
          <div className="flex flex-col gap-2">
            {form.keyDeliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={d}
                  onChange={(e) => setDeliverable(i, e.target.value)}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 transition-all"
                />
                {form.keyDeliverables.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(i)}
                    className="w-8 h-8 rounded-full border border-purple-950/10 hover:text-red-400 shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              className="text-xs font-bold text-purple-700 self-start pt-1"
            >
              + Add deliverable
            </button>
          </div>
        </FormSection>

        <FormActions
          onCancel={onClose}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          loadingLabel="Saving..."
        />
      </form>
    </FormPanel>
  );
};

export default EditCampaignForm;
