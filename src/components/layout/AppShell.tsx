import type { HTMLAttributes } from "react";
import { Outlet } from "react-router";
import { cn } from "../../lib/cn.ts";
import { NavMenu } from "./NavMenu.tsx";

export type AppShellProps = HTMLAttributes<HTMLDivElement>;

export function AppShell({ className, ...props }: AppShellProps) {
  return (
    <div
      className={cn("min-h-screen bg-background text-ink-primary", className)}
      {...props}
    >
      <NavMenu />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
