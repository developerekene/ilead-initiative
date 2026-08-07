import React, { useState } from "react";
import { FormPanel } from "../formcomponent/FormComponents";
import { WorkshopTypes } from "../../../utils/types";
import { authService } from "../../../redux/configuration/services/auth.service";
import toast from "react-hot-toast";

interface CreateWorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2;

const MODES: WorkshopTypes["mode"][] = ["Online", "Physical", "Hybrid"];
const LEVELS: WorkshopTypes["level"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];
const STATUSES: WorkshopTypes["status"][] = [
  "Open",
  "Almost Full",
  "Coming Soon",
  "Closed",
  "Completed",
];

const INPUT_CLS =
  "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm text-purple-950 placeholder:text-purple-950/20 font-medium focus:outline-none focus:border-purple-950 focus:bg-white transition-all";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  instructor: "",
  instructorRole: "",
  date: "",
  time: "",
  duration: "",
  location: "",
  mode: "" as WorkshopTypes["mode"] | "",
  level: "" as WorkshopTypes["level"] | "",
  status: "Open" as WorkshopTypes["status"],
  price: "",
  seats: "",
  registrationDeadline: "",
  image: "",
  tags: "",
};

const CreateWorkshopForm: React.FC<CreateWorkshopFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const set = (field: keyof typeof emptyForm, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const reset = () => {
    setStep(1);
    setLoading(false);
    setCreated(false);
    setError(null);
    setForm(emptyForm);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canProceedStep1 =
    form.title.trim().length >= 3 &&
    form.category.trim().length >= 2 &&
    form.description.trim().length >= 10 &&
    form.instructor.trim().length >= 2 &&
    form.instructorRole.trim().length >= 2;

  const seatsNumber = Number(form.seats);
  const canSubmit =
    form.date.trim().length > 0 &&
    form.time.trim().length > 0 &&
    form.duration.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.mode.length > 0 &&
    form.level.length > 0 &&
    form.price.trim().length > 0 &&
    Number.isFinite(seatsNumber) &&
    seatsNumber > 0 &&
    form.registrationDeadline.trim().length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await authService.handleCreateWorkshop({
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        instructor: form.instructor.trim(),
        instructorRole: form.instructorRole.trim(),
        date: form.date.trim(),
        time: form.time.trim(),
        duration: form.duration.trim(),
        location: form.location.trim(),
        mode: form.mode as WorkshopTypes["mode"],
        level: form.level as WorkshopTypes["level"],
        status: form.status,
        price: form.price.trim(),
        seats: seatsNumber,
        registrationDeadline: form.registrationDeadline.trim(),
        image: form.image.trim(),
        tags,
      });
      setCreated(true);
    } catch (e: any) {
      console.error("Workshop creation failed:", e);
      setError(e?.message ?? "Failed to create workshop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPanel
      isOpen={isOpen}
      onClose={handleClose}
      title={created ? "Workshop Created" : "Create a Workshop"}
      badge={created ? "Live" : `Step ${step} of 2`}
      badgeVariant="purple"
    >
      {created ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center mb-5 text-3xl">
            ✅
          </div>
          <h3 className="text-xl font-black text-purple-950 mb-2">
            Workshop Published!
          </h3>
          <p className="text-sm text-purple-950/50 font-medium leading-relaxed mb-8 max-w-xs">
            <span className="font-black text-purple-950">{form.title}</span> is
            now visible on the Workshops page.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-950 hover:bg-orange-500 text-white font-black px-8 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="flex gap-1">
            {([1, 2] as Step[]).map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-purple-950" : "bg-slate-100"
                }`}
              />
            ))}
          </div>

          {/* ── Step 1: Core details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Workshop Details
              </p>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Title <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Intro to Product Design"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Category <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="e.g. Design, Career, Tech"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Description <span className="text-orange-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What will participants learn or experience?"
                  rows={4}
                  className={`${INPUT_CLS} resize-none leading-relaxed`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Facilitator Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) => set("instructor", e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Facilitator Role <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.instructorRole}
                  onChange={(e) => set("instructorRole", e.target.value)}
                  placeholder="e.g. Senior Product Designer, Acme Inc."
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Logistics ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-purple-950/40">
                Logistics
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Date <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    placeholder="e.g. Sat, Sep 20"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Time <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Duration <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 2 hours"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Location <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. Zoom / Lagos Hub"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  Mode <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("mode", m)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                        form.mode === m
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  Level <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => set("level", l)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                        form.level === l
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-2 pl-0.5">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                        form.status === s
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-slate-50 border-purple-950/10 text-purple-950/60 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Price <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="e.g. ₦5,000 or Free"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                    Seats <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.seats}
                    onChange={(e) => set("seats", e.target.value)}
                    placeholder="e.g. 30"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Registration Deadline{" "}
                  <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.registrationDeadline}
                  onChange={(e) => set("registrationDeadline", e.target.value)}
                  placeholder="e.g. Sep 18, 2026"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Cover Image URL
                  <span className="text-purple-950/30 font-medium ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5">
                  Tags
                  <span className="text-purple-950/30 font-medium ml-1">
                    (comma separated, optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="e.g. Figma, UX Research, Portfolio"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-950/5">
            <button
              type="button"
              onClick={() =>
                step > 1 ? setStep((s) => (s - 1) as Step) : handleClose()
              }
              className="text-sm font-bold text-purple-950/40 hover:text-purple-950 transition-colors"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canProceedStep1}
                className="bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-7 py-3 rounded-xl text-sm tracking-wide transition-all duration-200"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="bg-purple-950 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-7 py-3 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  "Publish Workshop 🚀"
                )}
              </button>
            )}
          </div>
        </>
      )}
    </FormPanel>
  );
};

export default CreateWorkshopForm;
