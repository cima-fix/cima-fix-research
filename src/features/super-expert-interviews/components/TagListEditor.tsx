// src/features/extreme-users/components/TagListEditor.tsx
import { useId, useState } from "react";
import { Button } from "../../../components/ui/Button.tsx";
import { Input } from "../../../components/ui/Input.tsx";

// Matches the shape FormField injects (id, required, aria-*), so this
// component can be used as FormField's child just like Input/Select/TextArea.
export interface TagListEditorProps {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
  "aria-describedby"?: string;
}

export function TagListEditor({
  id,
  values,
  onChange,
  placeholder = "Type and press Enter",
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: TagListEditorProps) {
  // Text currently being typed into the "add new item" box
  const [draft, setDraft] = useState("");
  // Always call useId (hooks can't be called conditionally) and fall back to it
  const generatedId = useId();
  const inputId = id ?? generatedId;

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  }

  function removeItem(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          id={inputId}
          value={draft}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds the item instead of submitting the whole form
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="secondary" className="w-auto" onClick={addItem}>
          Add
        </Button>
      </div>

      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-body-xs text-ink-primary"
            >
              {value}
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label={`Remove ${value}`}
                className="text-ink-secondary hover:text-danger"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}