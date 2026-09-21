import type { HTMLAttributes } from "react";
import { Outlet } from "react-router";
import { cn } from "../../lib/cn.ts";
import { NavMenu, PAGE_GUTTER_X } from "./NavMenu.tsx";

export type AppShellProps = HTMLAttributes<HTMLDivElement>;

export function AppShell({ className, ...props }: AppShellProps) {
  return (
    <div
      className={cn("min-h-screen bg-background text-ink-primary", className)}
      {...props}
    >
      <NavMenu />
      <main className={cn("w-full py-8", PAGE_GUTTER_X)}>
        <Outlet />
      </main>
    </div>
  );
}
