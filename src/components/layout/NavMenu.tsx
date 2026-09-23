import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type SVGProps,
} from "react";
import { Link, NavLink } from "react-router";
import { cn } from "../../lib/cn.ts";
import { Button } from "../ui/Button.tsx";

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Entrevista a Expertos", path: "/expert-interviews" },
  { label: "Usuarios Extremos", path: "/extreme-users" },
  { label: "Needfinding", path: "/needfinding" },
  { label: "Empathy Map", path: "/empathy-map" },
  { label: "Roper Dynagram", path: "/roper-dynagram" },
  { label: "Mapeo de Requerimientos", path: "/requirements-mapping" },
];

export const PAGE_GUTTER_X = "px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-36";

const NAV_LINK_CLASSES = ({ isActive }: { isActive: boolean }) =>
  cn(
    "block w-full rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
    isActive
      ? "bg-secondary text-ink-primary"
      : "text-ink-secondary hover:bg-secondary hover:text-ink-primary",
  );

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export type NavMenuProps = HTMLAttributes<HTMLElement>;

export function NavMenu({ className, ...props }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    function handleOutsidePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={cn("border-b border-border bg-surface", className)}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 py-3",
          PAGE_GUTTER_X,
        )}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="text-heading-6 font-semibold text-ink-primary transition-colors hover:text-primary"
        >
          Cima Fix Research
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={NAV_LINK_CLASSES}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Button
          ref={toggleRef}
          type="button"
          variant="secondary"
          className="w-10 flex-shrink-0 px-0 lg:hidden"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isOpen && (
        <ul
          id={menuId}
          className={cn(
            "flex flex-col gap-1 border-t border-border py-3 lg:hidden",
            PAGE_GUTTER_X,
          )}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={closeMenu}
                className={NAV_LINK_CLASSES}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}