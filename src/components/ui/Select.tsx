import type { SelectHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn.ts";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>;
}

export function Select({ className, ref, children, ...props }: SelectProps) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full h-10 rounded-md border border-border bg-background px-3",
        "text-paragraph text-ink-primary transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
