import type { TextareaHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn.ts";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextArea({
  className,
  ref,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-md border border-border bg-background px-3 py-2 resize-y",
        "text-paragraph text-ink-primary placeholder:text-ink-input transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary",
        className,
      )}
      {...props}
    />
  );
}
