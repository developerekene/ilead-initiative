import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCampaign,
  type Campaign,
} from "../../../redux/slices/campaignSlice";
import { selectUser } from "../../../redux/slices/User";
import { addNotification } from "../../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { campaignService } from "../../../redux/configuration/services/campaign.service";
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
    candidates: ["", ""],
    candidatePhotos: ["", ""],
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

  const setCandidate = (i: number, value: string) =>
    setForm((prev) => {
      const updated = [...prev.candidates];
      updated[i] = value;
      return { ...prev, candidates: updated };
    });

  const handlePhotoUpload = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 1.5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("Image size must be less than 1.5MB.", {
          style: { background: "#ff4d4f", color: "#fff" },
        });
        // Clear the file input
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => {
          const updatedPhotos = [...prev.candidatePhotos];
          updatedPhotos[i] = reader.result as string;
          return { ...prev, candidatePhotos: updatedPhotos };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addCandidate = () =>
    setForm((prev) => ({
      ...prev,
      candidates: [...prev.candidates, ""],
      candidatePhotos: [...prev.candidatePhotos, ""],
    }));

  const removeCandidate = (i: number) =>
    setForm((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((_, idx) => idx !== i),
      candidatePhotos: prev.candidatePhotos.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("You must be logged in to create a campaign.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let validCandidates = form.candidates;
      let validPhotos = form.candidatePhotos;

      if (form.category === "Election") {
        const hasIncomplete = form.candidates.some(
          (c, idx) =>
            (c && !form.candidatePhotos[idx]) ||
            (!c && form.candidatePhotos[idx]),
        );
        if (hasIncomplete) {
          toast.error(
            "Please ensure every entered candidate has both a name and a photo.",
            {
              style: { background: "#ff4d4f", color: "#fff" },
            },
          );
          setIsSubmitting(false);
          return;
        }

        validCandidates = [];
        validPhotos = [];
        form.candidates.forEach((c, idx) => {
          if (c && form.candidatePhotos[idx]) {
            validCandidates.push(c);
            validPhotos.push(form.candidatePhotos[idx]);
          }
        });

        if (validCandidates.length < 2) {
          toast.error(
            "Please provide at least two candidates with photos for the election.",
            {
              style: { background: "#ff4d4f", color: "#fff" },
            },
          );
          setIsSubmitting(false);
          return;
        }
      } else {
        validCandidates = form.candidates.filter(Boolean);
      }

      const newCampaign = {
        ...form,
        id: uuidv4(),
        creatorId: user.uid,
        keyDeliverables:
          form.category === "Election"
            ? []
            : form.keyDeliverables.filter(Boolean),
        candidates: validCandidates,
        candidatePhotos: validPhotos,
      } as Campaign & { creatorId?: string };

      // 1. Save to Firebase Firestore under the user's specific document
      await campaignService.createCampaign(user.uid, newCampaign);

      // 2. If Firebase succeeds, save to Redux State so the UI updates instantly
      dispatch(addCampaign(newCampaign));

      // 2.5. Dispatch a notification so the bell lights up
      dispatch(
        addNotification({
          id: uuidv4(),
          caseId: newCampaign.id,
          type: "NEW_CAMPAIGN",
          title: "Campaign Launched",
          message: `${newCampaign.title}`,
          timestamp: new Date().toISOString(),
          isUnread: true,
          senderName: user.displayName || user.firstName || "You",
          metadata: {
            "Campaign Title": newCampaign.title,
            Category: newCampaign.category,
            Description: newCampaign.description,
            "Metric Label": newCampaign.metricLabel,
            "Metric Value": newCampaign.metricValue,
          },
        }),
      );

      // 3. Reset Form & Close Modal
      setForm({
        title: "",
        category: "Tech Mentorship",
        description: "",
        metricLabel: "",
        metricValue: "",
        statusBadge: "In Progress",
        longFormBody: "",
        keyDeliverables: [""],
        candidates: ["", ""],
        candidatePhotos: ["", ""],
      });

      toast.success("Campaign launched successfully!", {
        style: { background: "#4BB543", color: "#fff" },
      });
      onClose();
    } catch (error) {
      console.error("Failed to launch campaign", error);
      toast.error("Failed to launch campaign. Please try again.", {
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
              { value: "Election", label: "Election" },
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

        {form.category !== "Election" && (
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
        )}

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

        {/* Key deliverables */}
        {form.category !== "Election" && (
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
        )}

        {form.category === "Election" && (
          <FormSection title="Election Candidates">
            <div className="flex flex-col gap-2">
              {form.candidates.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 bg-white border border-purple-950/5 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Candidate ${i + 1} Name`}
                      value={c}
                      onChange={(e) => setCandidate(i, e.target.value)}
                      className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    />
                    {form.candidates.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeCandidate(i)}
                        className="w-8 h-8 shrink-0 rounded-full border border-purple-950/10 hover:border-red-400 hover:text-red-400 text-purple-950/30 flex items-center justify-center text-sm transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {form.candidatePhotos[i] ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/20 shrink-0">
                        <img
                          src={form.candidatePhotos[i]}
                          alt={`Candidate ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                        No Pic
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-2 rounded-lg text-center transition-colors">
                        {form.candidatePhotos[i]
                          ? "Change Photo"
                          : "Upload Photo"}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(i, e)}
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCandidate}
                className="text-xs font-bold text-purple-700 self-start hover:text-orange-500 transition-colors pt-1"
              >
                + Add another candidate
              </button>
            </div>
          </FormSection>
        )}

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
