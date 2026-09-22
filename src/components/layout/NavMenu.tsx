import type { HTMLAttributes } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "../../lib/cn.ts";

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Entrevista a Expertos", path: "/expert-interviews" },
  { label: "Usuarios Extremos", path: "/extreme-users" },
  { label: "Empathy Map", path: "/empathy-map" },
  { label: "Roper Dynagram", path: "/roper-dynagram" },
];

export const PAGE_GUTTER_X = "px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-36";

export type NavMenuProps = HTMLAttributes<HTMLElement>;

export function NavMenu({ className, ...props }: NavMenuProps) {
  return (
    <nav
      className={cn(
        "flex w-full items-center justify-between gap-4 border-b border-border bg-surface py-3",
        PAGE_GUTTER_X,
        className,
      )}
      {...props}
    >
      <Link
        to="/"
        className="text-heading-6 font-semibold text-ink-primary transition-colors hover:text-primary"
      >
        Cima Fix Research
      </Link>

      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-ink-primary"
                    : "text-ink-secondary hover:bg-secondary hover:text-ink-primary",
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
