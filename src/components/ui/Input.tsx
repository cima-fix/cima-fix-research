import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn.ts";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full h-10 rounded-md border border-border bg-background px-3",
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
