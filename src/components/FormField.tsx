interface FormFieldProps {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, helper, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide uppercase text-off-white/60">
        {label}
      </label>
      {children}
      {helper && !error && (
        <p className="text-xs text-mid-grey leading-relaxed">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-magenta">{error}</p>
      )}
    </div>
  );
}
