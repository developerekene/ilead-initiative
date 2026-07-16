import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/User";
import { addNotification } from "../../redux/slices/notificationSlice";
import { v4 as uuidv4 } from "uuid";

const VideoTestimonialUpload: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core file & submission states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [giveConsent, setGiveConsent] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Progress tracker states
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Feedback messaging
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Constraints setup
  const MAX_FILE_SIZE_MB = 100;
  const ALLOWED_TYPES = ["video/mp4", "video/quicktime"]; // .mp4 and .mov

  const validateAndSetFile = (file: File) => {
    setFeedback({ type: null, message: "" });

    // 1. Validate File Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFeedback({
        type: "error",
        message: "Format Error: Please upload a valid .mp4 or .mov video file.",
      });
      return;
    }

    // 2. Validate File Size (100MB Cap)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      setFeedback({
        type: "error",
        message: `File Too Large: Your file size is ${fileSizeInMB.toFixed(1)}MB. It must be under ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    setSelectedFile(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setFeedback({
        type: "error",
        message: "Please drop or select a video to upload first.",
      });
      return;
    }

    // Acceptance Criteria Check: Consent verification lock
    if (!giveConsent) {
      setFeedback({
        type: "error",
        message:
          "Consent Required: You must accept the community showcase check-box to continue.",
      });
      return;
    }

    // Simulate Production Upload Sequence with Progress Tracking
    setIsUploading(true);
    setUploadProgress(0);
    setFeedback({ type: null, message: "" });

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          dispatch(
            addNotification({
              id: uuidv4(),
              caseId: `testimonial-${Date.now()}`,
              type: "COMPLETED",
              title: "Testimonial Uploaded",
              message:
                "Your video testimony has been processed and is now part of the community showcase.",
              timestamp: "Just now",
              isUnread: true,
              senderName: "iLEAD",
            }),
          );
          setFeedback({
            type: "success",
            message:
              "Thank you! Your video testimony has processed successfully and is synced with the community showcase network.",
          });
          setSelectedFile(null);
          setGiveConsent(false);
          return 0;
        }
        return prev + 10; // Increment progress by 10% every 250ms
      });
    }, 250);
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-purple-950/5 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-purple-950/[0.02]">
        {/* Header Module */}
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
            ITRAIN Pipeline
          </span>
          <h2 className="text-2xl font-black text-purple-950 tracking-tight mt-3">
            Share Your Impact Story
          </h2>
          <p className="text-sm text-purple-950/50 font-medium mt-1">
            Encourage fellow students across the workspace. Record how adjusting
            your study habits or grades built your academic momentum.
          </p>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Interactive Drop-Zone Canvas Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFilePicker}
            className={`w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
              isDragging
                ? "border-orange-500 bg-orange-50/30 scale-[0.99]"
                : selectedFile
                  ? "border-purple-900 bg-purple-50/10"
                  : "border-purple-950/10 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-950/20"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".mp4,.mov"
              className="hidden"
            />

            {/* Drop Zone Vector States */}
            {!selectedFile ? (
              <>
                <div className="w-12 h-12 bg-purple-50 text-purple-950 rounded-xl flex items-center justify-center mb-3 text-xl shadow-sm">
                  🎥
                </div>
                <p className="text-sm font-bold text-purple-950">
                  Drag and drop your testimony video, or{" "}
                  <span className="text-orange-500 underline">browse</span>
                </p>
                <p className="text-xs text-purple-950/40 font-medium mt-1.5">
                  Supports MP4 or MOV format structures up to 100MB maximum
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 text-xl shadow-sm">
                  ✅
                </div>
                <p className="text-sm font-black text-purple-950 line-clamp-1 max-w-md px-2">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold mt-2">
                  Ready: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            )}
          </div>

          {/* Interactive Progress Tracking Animation Loader */}
          {isUploading && (
            <div className="bg-slate-50 border border-purple-950/[0.02] rounded-xl p-4 space-y-2 animate-pulse">
              <div className="flex justify-between items-center text-xs font-bold text-purple-950">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Streaming pipeline payload uploads...
                </span>
                <span className="font-black text-orange-500">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-950 to-orange-500 h-full transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-purple-950/40 font-medium text-center pt-1">
                Reassuring note: Do not exit or clear this viewport until the
                verification layer clears.
              </p>
            </div>
          )}

          {/* Mandatory Digital Consent Switch Module */}
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-purple-950/[0.02]">
            <input
              type="checkbox"
              id="consentCheckbox"
              checked={giveConsent}
              onChange={(e) => setGiveConsent(e.target.checked)}
              disabled={isUploading}
              className="w-4 h-4 mt-0.5 text-orange-500 border-purple-950/10 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
            />
            <label
              htmlFor="consentCheckbox"
              className="text-xs font-semibold text-purple-950/70 leading-relaxed cursor-pointer select-none"
            >
              I verify and grant absolute authorization to add this video file
              onto the public community showcase directory, enabling other
              platform learners to use my insights.
            </label>
          </div>

          {/* Operational Responses Feedback Box */}
          {feedback.type && !isUploading && (
            <div
              className={`p-4 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 ${
                feedback.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Action Executer Trigger Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                setSelectedFile(null);
                setGiveConsent(false);
                setFeedback({ type: null, message: "" });
              }}
              className="w-full bg-white hover:bg-slate-50 border-2 border-purple-950/10 text-purple-950 font-black py-4 px-6 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isUploading || !selectedFile || !giveConsent}
              className="w-full bg-orange-500 hover:bg-purple-900 text-white font-black py-4 px-6 rounded-xl text-sm tracking-wide shadow-lg shadow-orange-500/10 hover:shadow-purple-900/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-40 disabled:transform-none disabled:cursor-not-allowed"
            >
              Process Upload
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default VideoTestimonialUpload;
