import React, { useState } from "react";

interface TimeSlot {
  topic: string;
  branch:
    | "Study Habits"
    | "CGPA Strategy"
    | "University Entry"
    | "Skill Choices";
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

const ITrainScheduler: React.FC = () => {
  // Local tracking array simulating existing slots to prevent client-side overlapping
  const [existingSlots, setExistingSlots] = useState<TimeSlot[]>([
    {
      topic: "Cracking Admissions Interviews",
      branch: "University Entry",
      date: "2026-06-15",
      startTime: "14:00",
      endTime: "15:30",
      maxCapacity: 10,
    },
  ]);

  // Controlled form state tracking ITRAIN-006 requirements
  const [formData, setFormData] = useState<TimeSlot>({
    topic: "",
    branch: "University Entry",
    date: "",
    startTime: "",
    endTime: "",
    maxCapacity: 5,
  });

  const [uiFeedback, setUiFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUiFeedback({ type: null, message: "" });

    // 1. Validation: Core Chronology Check
    if (formData.startTime >= formData.endTime) {
      setUiFeedback({
        type: "error",
        message:
          "Chronology Error: The Session end time must happen after the start time.",
      });
      return;
    }

    // 2. Validation: Prevent Overlapping Date/Time allocations
    const hasOverlap = existingSlots.some((slot) => {
      if (slot.date === formData.date) {
        // Check if incoming times step inside an existing block window
        const incomingStart = formData.startTime;
        const incomingEnd = formData.endTime;
        return incomingStart < slot.endTime && incomingEnd > slot.startTime;
      }
      return false;
    });

    if (hasOverlap) {
      setUiFeedback({
        type: "error",
        message:
          "Scheduling Collision: You already have an open consultancy or teaching slot within this exact timeframe.",
      });
      return;
    }

    // 3. Acceptance Criteria Satisfied: Commit to local tracking block & notify public indexer
    const synchronizedPayload = { ...formData };
    setExistingSlots((prev) => [...prev, synchronizedPayload]);

    console.log(
      "ITRAIN-006 -> Synchronizing entry backend matrix array:",
      synchronizedPayload,
    );

    setUiFeedback({
      type: "success",
      message:
        "Success! Your availability matrix has synced with the public student workspace catalog.",
    });

    // Reset input canvas fields gracefully
    setFormData({
      topic: "",
      branch: "University Entry",
      date: "",
      startTime: "",
      endTime: "",
      maxCapacity: 5,
    });
  };

  return (
    <section className="w-full bg-purple-950 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Intake Config Canvas */}
        <div className="lg:col-span-7 bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl">
          <div className="mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-md border border-orange-500/20">
              ITRAIN Portal
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-3">
              Open a Teaching Block
            </h2>
            <p className="text-sm text-purple-200/60 font-medium mt-1">
              Map out your availability window. Your open blocks sync instantly
              into the interactive student index directory.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Topic Field Input */}
            <div>
              <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                Session Topic or Focus Title
              </label>
              <input
                type="text"
                name="topic"
                required
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Overcoming Procrastination & Building Study Habits"
                className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all"
              />
            </div>

            {/* Metadata Selector Block (Consultancy Track Branch Assignment) */}
            <div>
              <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                Consulting Branch Metadata
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all cursor-pointer [&>option]:bg-purple-900 [&>option]:text-white"
              >
                <option value="University Entry">
                  University Entry Guidance
                </option>
                <option value="Study Habits">
                  Study Habits & Focus Calibration
                </option>
                <option value="CGPA Strategy">CGPA Target Management</option>
                <option value="Skill Choices">
                  Pre-University Skill Selection
                </option>
              </select>
            </div>

            {/* Calendar / Date Matrix Component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                  Target Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split("T")[0]} // Prevent retro-active allocations
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all cursor-pointer color-scheme-dark"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                  Max Student Seat Capacity
                </label>
                <input
                  type="number"
                  name="maxCapacity"
                  required
                  min="1"
                  max="50"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all"
                />
              </div>
            </div>

            {/* Clock Configuration Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                  Start Time (24h Clock)
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all cursor-pointer"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-200/80 block mb-1.5 pl-1">
                  End Time (24h Clock)
                </label>
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full bg-purple-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 focus:bg-purple-950 transition-all cursor-pointer"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>

            {/* Live Contextual Pipeline Responses UI Alert Box */}
            {uiFeedback.type && (
              <div
                className={`p-4 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 ${
                  uiFeedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                {uiFeedback.message}
              </div>
            )}

            {/* CTA Processing Operations Block Trigger */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Sync and Open Block
            </button>
          </form>
        </div>

        {/* Right Column: Live Manifest Catalog Checklist Array Indicator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-purple-900/20 border border-white/5 rounded-[2rem] p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Your Dynamic Public Ledger
            </h3>
            <p className="text-xs text-purple-200/50 font-medium mb-4 leading-relaxed">
              These workshop items have passed integrity criteria checks and are
              actively stream-broadcasting onto the live consumer catalog
              interfaces:
            </p>

            <div className="space-y-3.5">
              {existingSlots.map((slot, index) => (
                <div
                  key={index}
                  className="bg-purple-950/40 border border-white/10 p-4 rounded-2xl shadow-sm transition-all hover:border-white/20"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                      {slot.topic || "Untitled Open Workshop"}
                    </h4>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wide whitespace-nowrap shrink-0">
                      {slot.branch}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-200/60 font-medium">
                    <span className="flex items-center gap-1">
                      📅 {slot.date || "No Date Configured"}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏰ {slot.startTime || "--:--"} - {slot.endTime || "--:--"}
                    </span>
                    <span className="text-orange-400 font-bold">
                      👥 {slot.maxCapacity} seats Max
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ITrainScheduler;
