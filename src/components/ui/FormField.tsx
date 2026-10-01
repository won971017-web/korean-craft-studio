import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  /** render-prop: 입력 요소에 붙일 접근성 속성을 받는다. */
  children: (a11y: { id: string; "aria-invalid": boolean; "aria-describedby": string | undefined; "aria-required": boolean }) => ReactNode;
}

export function FormField({ id, label, required = false, error, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="ml-1 text-xs text-clay-strong">(필수)</span> : null}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required })}
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <p id={errorId} role="alert" className="min-h-0 text-sm text-danger empty:hidden">
        {error ?? ""}
      </p>
    </div>
  );
}

export const inputClass =
  "w-full min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-base text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink aria-[invalid=true]:border-danger";
