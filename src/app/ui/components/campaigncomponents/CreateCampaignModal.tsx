import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addCampaign,
  type Campaign,
} from "../../../redux/slices/campaignSlice";
import { v4 as uuidv4 } from "uuid";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Tech Mentorship",
  "Business Strategy",
  "Community Giving",
] as const;

const CreateCampaignModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addCampaign({
        ...form,
        id: uuidv4(),
        keyDeliverables: form.keyDeliverables.filter(Boolean),
      }),
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-purple-950 tracking-tight">
            Create New Campaign
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-purple-950/10 hover:border-purple-950 flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Campaign Title
            </label>
            <input
              required
              type="text"
              placeholder="e.g., The Developer Resilience Fund"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
                Status Badge
              </label>
              <input
                required
                type="text"
                placeholder="e.g., In Progress"
                value={form.statusBadge}
                onChange={(e) => set("statusBadge", e.target.value)}
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Short description */}
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Short Description (card preview)
            </label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
            />
          </div>

          {/* Metric */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
                Metric Label
              </label>
              <input
                required
                type="text"
                placeholder="e.g., Members Served"
                value={form.metricLabel}
                onChange={(e) => set("metricLabel", e.target.value)}
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
                Metric Value
              </label>
              <input
                required
                type="text"
                placeholder="e.g., 200+ Members"
                value={form.metricValue}
                onChange={(e) => set("metricValue", e.target.value)}
                className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Long body */}
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Full Campaign Body (detail page)
            </label>
            <textarea
              required
              rows={4}
              value={form.longFormBody}
              onChange={(e) => set("longFormBody", e.target.value)}
              className="w-full bg-slate-50 border border-purple-950/10 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
            />
          </div>

          {/* Key deliverables */}
          <div>
            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">
              Key Deliverables
            </label>
            <div className="flex flex-col gap-2">
              {form.keyDeliverables.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Deliverable ${i + 1}`}
                  value={d}
                  onChange={(e) => setDeliverable(i, e.target.value)}
                  className="w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                />
              ))}
              <button
                type="button"
                onClick={addDeliverable}
                className="text-xs font-bold text-purple-700 self-start hover:text-orange-500 transition-colors"
              >
                + Add another deliverable
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-purple-950/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-purple-950/60 font-bold text-sm rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] bg-purple-950 hover:bg-orange-500 text-white font-black py-3.5 rounded-xl text-sm tracking-wide shadow-md transition-all"
            >
              Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
