// ============================================================
// iLEAD Reusable Form Component System
// All components share the exact style contract from CampaignDetails
// Usage: compose any form from these primitives
// ============================================================

import React from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface FormFieldProps {
  label: string;
  required?: boolean;
  fieldNote?: string; // e.g. "(Field 5)" or "(Optional)"
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fieldNote?: string;
  error?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  fieldNote?: string;
  rows?: number;
  error?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  fieldNote?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export interface FormRowProps {
  cols?: 1 | 2;
  children: React.ReactNode;
}

export interface FormDividerProps {
  label?: string;
}

export interface FormClauseProps {
  icon?: string;
  title: string;
  body: string;
}

export interface FormActionsProps {
  onCancel?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  loadingLabel?: string;
  submitVariant?: "primary" | "danger";
}

export interface FormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  badgeVariant?: "purple" | "orange";
  children: React.ReactNode;
}

export interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

// ─────────────────────────────────────────────
// STYLE TOKENS — single source of truth
// ─────────────────────────────────────────────

const TOKEN = {
  input:
    "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all",
  inputError:
    "w-full bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-red-500 focus:bg-white transition-all",
  label: "text-xs font-bold text-purple-950/70 block mb-1.5 pl-0.5",
  fieldNote: "text-purple-950/40 font-medium ml-1",
  errorMsg: "text-xs text-red-500 font-medium mt-1 pl-0.5",
  select:
    "w-full bg-slate-50 border border-purple-950/10 rounded-xl px-4 py-3 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 focus:bg-white transition-all cursor-pointer appearance-none",
  textarea:
    "w-full bg-slate-50 border border-purple-950/10 rounded-xl p-4 text-sm font-medium text-purple-950 placeholder:text-purple-950/30 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed",
};

// ─────────────────────────────────────────────
// FIELD WRAPPER — label + children + error slot
// ─────────────────────────────────────────────

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  fieldNote,
  children,
}) => (
  <div>
    <label className={TOKEN.label}>
      {label}
      {fieldNote && <span className={TOKEN.fieldNote}>{fieldNote}</span>}
      {required && <span className="text-orange-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────

export const FormInput: React.FC<InputProps> = ({
  label,
  fieldNote,
  error,
  required,
  className,
  ...props
}) => (
  <FormField label={label} fieldNote={fieldNote} required={required}>
    <input
      required={required}
      className={`${error ? TOKEN.inputError : TOKEN.input} ${className ?? ""}`}
      {...props}
    />
    {error && <p className={TOKEN.errorMsg}>{error}</p>}
  </FormField>
);

// ─────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────

export const FormTextarea: React.FC<TextareaProps> = ({
  label,
  fieldNote,
  error,
  required,
  rows = 4,
  className,
  ...props
}) => (
  <FormField label={label} fieldNote={fieldNote} required={required}>
    <textarea
      required={required}
      rows={rows}
      className={`${error ? TOKEN.inputError : TOKEN.textarea} ${className ?? ""}`}
      {...props}
    />
    {error && <p className={TOKEN.errorMsg}>{error}</p>}
  </FormField>
);

// ─────────────────────────────────────────────
// SELECT — custom chevron icon
// ─────────────────────────────────────────────

export const FormSelect: React.FC<SelectProps> = ({
  label,
  fieldNote,
  options,
  error,
  required,
  className,
  ...props
}) => (
  <FormField label={label} fieldNote={fieldNote} required={required}>
    <div className="relative">
      <select
        required={required}
        className={`${TOKEN.select} pr-10 ${className ?? ""}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
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
    {error && <p className={TOKEN.errorMsg}>{error}</p>}
  </FormField>
);

// ─────────────────────────────────────────────
// FORM ROW — 1 or 2 column grid
// ─────────────────────────────────────────────

export const FormRow: React.FC<FormRowProps> = ({ cols = 2, children }) => (
  <div
    className={`grid gap-4 ${cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────
// FORM DIVIDER — optional label between sections
// ─────────────────────────────────────────────

export const FormDivider: React.FC<FormDividerProps> = ({ label }) => {
  if (!label) return <hr className="border-purple-950/5 my-2" />;
  return (
    <div className="flex items-center gap-3 my-2">
      <hr className="flex-1 border-purple-950/5" />
      <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/30">
        {label}
      </span>
      <hr className="flex-1 border-purple-950/5" />
    </div>
  );
};

// ─────────────────────────────────────────────
// FORM SECTION — optional titled group
// ─────────────────────────────────────────────

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => (
  <div className="space-y-5">
    {title && (
      <p className="text-[10px] font-black uppercase tracking-widest text-purple-950/40">
        {title}
      </p>
    )}
    {children}
  </div>
);

// ─────────────────────────────────────────────
// FORM CLAUSE — info/disclaimer box
// ─────────────────────────────────────────────

export const FormClause: React.FC<FormClauseProps> = ({
  icon = "💡",
  title,
  body,
}) => (
  <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-4 text-xs text-purple-950/80 font-medium leading-relaxed">
    {icon} <strong>{title}:</strong> {body}
  </div>
);

// ─────────────────────────────────────────────
// FORM ACTIONS — cancel + submit button row
// ─────────────────────────────────────────────

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
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
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  isSubmitting = false,
  loadingLabel = "Processing...",
  submitVariant = "primary",
}) => {
  const submitBase =
    "flex-[2] font-black py-3.5 px-4 rounded-xl text-center text-sm tracking-wide shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer";
  const submitColor =
    submitVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/10"
      : "bg-purple-950 hover:bg-orange-500 text-white hover:shadow-orange-500/10";

  return (
    <div className="pt-4 border-t border-purple-950/5 flex items-center gap-3">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-purple-950/60 font-bold text-sm rounded-xl transition-all cursor-pointer"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${submitBase} ${submitColor}`}
      >
        {isSubmitting ? (
          <>
            <Spinner />
            {loadingLabel}
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// FORM PANEL — the slide-over shell
// ─────────────────────────────────────────────

export const FormPanel: React.FC<FormPanelProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  badgeVariant = "purple",
  children,
}) => {
  const badgeColor =
    badgeVariant === "orange"
      ? "bg-orange-100 text-orange-800"
      : "bg-purple-100 text-purple-800";

  return (
    <div
      className={`fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed inset-y-0 right-0 h-full bg-white border-l border-purple-950/10 shadow-2xl w-full lg:w-[40%] flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel header */}
        <div className="p-6 md:p-8 border-b border-purple-950/5 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            {badge && (
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-1 inline-block ${badgeColor}`}
              >
                {badge}
              </span>
            )}
            <h3 className="text-lg font-black text-purple-950 tracking-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-purple-950/10 hover:border-purple-950 text-purple-950 flex items-center justify-center font-bold text-sm transition-all cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// FORM MODAL — centered modal variant
// ─────────────────────────────────────────────

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  badgeVariant?: "purple" | "orange";
  maxWidth?: string;
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  badgeVariant = "purple",
  maxWidth = "max-w-xl",
  children,
}) => {
  if (!isOpen) return null;

  const badgeColor =
    badgeVariant === "orange"
      ? "bg-orange-100 text-orange-800"
      : "bg-purple-100 text-purple-800";

  return (
    <div
      className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[2rem] w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-8 flex flex-col gap-5`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            {badge && (
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-1 inline-block ${badgeColor}`}
              >
                {badge}
              </span>
            )}
            <h2 className="text-xl font-black text-purple-950 tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-purple-950/10 hover:border-purple-950 flex items-center justify-center text-sm font-bold transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
