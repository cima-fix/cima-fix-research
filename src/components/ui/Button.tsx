import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn.ts";

type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  ref?: Ref<HTMLButtonElement>;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-ink-light hover:bg-primary-hover",
  secondary: "bg-secondary text-ink-primary hover:bg-secondary-hover",
  danger: "bg-danger text-ink-light hover:bg-danger-hover",
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(
        "w-full inline-flex items-center justify-center gap-2 rounded-md h-10 px-4",
        "text-paragraph font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
