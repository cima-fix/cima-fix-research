import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { Button } from "./Button.tsx";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
      className={cn(
        "w-full max-w-md rounded-md border border-border bg-surface p-0",
        "backdrop:bg-ink-primary/50",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2
          id={titleId}
          className="text-heading-6 font-medium text-ink-primary"
        >
          {title}
        </h2>
        <Button
          variant="secondary"
          className="h-8 w-auto px-2"
          onClick={() => dialogRef.current?.close()}
          aria-label="Cerrar"
        >
          ✕
        </Button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-4 py-4">{children}</div>
    </dialog>
  );
}
