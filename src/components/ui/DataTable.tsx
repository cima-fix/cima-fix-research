import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { Button } from "./Button.tsx";

export interface DataTableColumn<T> {
  id?: string;
  key: keyof T & string;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  getRowLabel?: (item: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  getRowLabel = (_item, index) => `fila ${index + 1}`,
  emptyMessage = "Todavía no hay registros.",
  className,
}: DataTableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete);

  if (data.length === 0) {
    return (
      <p className={cn("w-full text-body-sm text-ink-secondary", className)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-md border border-border",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((column) => (
              <th
                key={column.id ?? column.key}
                scope="col"
                className="px-3 py-2 text-body-sm font-medium text-ink-secondary"
              >
                {column.header}
              </th>
            ))}
            {hasActions && (
              <th
                scope="col"
                className="px-3 py-2 text-body-sm font-medium text-ink-secondary"
              >
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const rowLabel = getRowLabel(item, index);

            return (
              <tr
                key={item.id}
                className="border-b border-border last:border-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.id ?? column.key}
                    className="px-3 py-2 align-top text-body-sm text-ink-primary"
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key] ?? "")}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-3 py-2 align-top">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          variant="secondary"
                          className="w-auto h-8 px-3"
                          onClick={() => onEdit(item)}
                          aria-label={`Editar ${rowLabel}`}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="danger"
                          className="w-auto h-8 px-3"
                          onClick={() => onDelete(item)}
                          aria-label={`Eliminar ${rowLabel}`}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
