// features/expert-interviews/components/TagListEditor.tsx
// Simple string list editor (e.g., "key concepts", "constraints").

import { useId, useState } from "react";
import { Badge } from "../../../components/ui/Badge.tsx";
import { Button } from "../../../components/ui/Button.tsx";
import { Input } from "../../../components/ui/Input.tsx";

export interface TagListEditorProps {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}

export function TagListEditor({ label, values, onChange }: TagListEditorProps) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  function handleAdd() {
    const trimmed = draft.trim();
    if (trimmed === "") return;
    onChange([...values, trimmed]);
    setDraft("");
  }

  function handleRemove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-body-sm font-medium text-ink-primary">
        {label}
      </label>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <Badge key={`${value}-${index}`} variant="neutral" className="gap-1.5">
              {value}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Eliminar "${value}"`}
                className="text-ink-secondary hover:text-danger"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Agregar y presionar Enter"
        />
        <Button type="button" variant="secondary" className="w-auto" onClick={handleAdd}>
          Agregar
        </Button>
      </div>
    </div>
  );
}