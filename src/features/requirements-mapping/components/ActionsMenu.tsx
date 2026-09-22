// features/requirements-mapping/components/ActionsMenu.tsx
// Figma: each row in the vínculos list uses a "⋯" (kebab) menu for
// Edit/Delete instead of two separate buttons — more compact in the
// card, and it's what collapses best in the mobile view (one column).
// Local to this interface: not a shared components/ui/ component, so it
// doesn't need to be coordinated with the lead.

import { useEffect, useId, useRef, useState } from "react";

export interface ActionsMenuProps {
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsMenu({ label, onEdit, onDelete }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Acciones para: ${label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-secondary transition-colors hover:bg-secondary hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={`Acciones para: ${label}`}
          className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-border bg-surface py-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full px-3 py-2 text-left text-body-sm text-ink-primary hover:bg-secondary"
          >
            Editar
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full px-3 py-2 text-left text-body-sm text-danger hover:bg-secondary"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
