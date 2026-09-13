import { cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "../../lib/cn.ts";

type FieldElement = ReactElement<{
  id?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-describedby"?: string;
}>;

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: FieldElement;
}

export function FormField({
  id,
  label,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  const field = isValidElement(children)
    ? cloneElement(children, {
        id,
        required,
        "aria-invalid": Boolean(error),
        "aria-required": required || undefined,
        "aria-describedby": error ? errorId : undefined,
      })
    : children;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-body-sm font-medium text-ink-primary">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {field}
      {error && (
        <p id={errorId} role="alert" className="text-body-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
