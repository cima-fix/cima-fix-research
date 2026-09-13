import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn.ts";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-border bg-surface p-4",
        className,
      )}
      {...props}
    />
  );
}
