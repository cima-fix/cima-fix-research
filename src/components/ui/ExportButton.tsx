import { cn } from "../../lib/cn.ts";
import { exportToCSV, exportToJSON } from "../../lib/export.ts";
import { Button } from "./Button.tsx";

export interface ExportButtonProps<T extends object> {
  data: T[];
  filename: string;
  className?: string;
}

export function ExportButton<T extends object>({
  data,
  filename,
  className,
}: ExportButtonProps<T>) {
  const disabled = data.length === 0;

  return (
    <div className={cn("w-full flex flex-wrap gap-2", className)}>
      <Button
        variant="secondary"
        className="w-auto"
        disabled={disabled}
        onClick={() => exportToJSON(data, filename)}
      >
        Exportar JSON
      </Button>
      <Button
        variant="secondary"
        className="w-auto"
        disabled={disabled}
        onClick={() => exportToCSV(data, filename)}
      >
        Exportar CSV
      </Button>
    </div>
  );
}
