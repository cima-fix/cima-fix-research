// src/features/extreme-users/components/ExtremeUserForm.tsx
import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button.tsx";
import { FormField } from "../../../components/ui/FormField.tsx";
import { Input } from "../../../components/ui/Input.tsx";
import { Select } from "../../../components/ui/Select.tsx";
import { TextArea } from "../../../components/ui/TextArea.tsx";
import { TagListEditor } from "./TagListEditor.tsx";
import {
  CLASSIFICATION_LABELS,
  type ExtremeUser,
  type UserClassification,
} from "../types.ts";

// Everything on ExtremeUser except "id" — lib/list.ts generates that for us
export type ExtremeUserFormValues = Omit<ExtremeUser, "id">;

export interface ExtremeUserFormProps {
  initialValues?: ExtremeUser | null; // null/undefined = creating a new one
  onSubmit: (values: ExtremeUserFormValues) => void;
  onCancel: () => void;
}

const EMPTY_VALUES: ExtremeUserFormValues = {
  classification: "mainstream",
  alias: "",
  usageContext: "",
  usageFrequency: "",
  skillLevel: 5,
  observedTasks: [],
  workarounds: [],
  amplifiedFrictions: [],
  extremeNeed: "",
  generalizationHypothesis: "",
  evidence: [],
};

export function ExtremeUserForm({
  initialValues,
  onSubmit,
  onCancel,
}: ExtremeUserFormProps) {
  const [values, setValues] = useState<ExtremeUserFormValues>(
    initialValues ?? EMPTY_VALUES,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExtremeUserFormValues, string>>
  >({});

  // Generic helper: updateField("alias", "some text") instead of
  // repeating `setValues(prev => ({ ...prev, alias: "some text" }))` everywhere
  function updateField<K extends keyof ExtremeUserFormValues>(
    field: K,
    value: ExtremeUserFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: typeof errors = {};
    if (!values.alias.trim()) nextErrors.alias = "Alias is required.";
    if (!values.extremeNeed.trim())
      nextErrors.extremeNeed = "Describe the extreme need detected.";
    if (values.skillLevel < 1 || values.skillLevel > 10)
      nextErrors.skillLevel = "Must be between 1 and 10.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // stop the browser's default full-page reload
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField id="alias" label="Alias" required error={errors.alias}>
        <Input value={values.alias} onChange={(e) => updateField("alias", e.target.value)} />
      </FormField>

      <FormField id="classification" label="Classification" required>
        <Select
          value={values.classification}
          onChange={(e) =>
            updateField("classification", e.target.value as UserClassification)
          }
        >
          {Object.entries(CLASSIFICATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField id="usageContext" label="Usage context">
        <Input
          value={values.usageContext}
          onChange={(e) => updateField("usageContext", e.target.value)}
        />
      </FormField>

      <FormField id="usageFrequency" label="Usage frequency">
        <Input
          value={values.usageFrequency}
          placeholder="e.g. daily, 2-3 times a week"
          onChange={(e) => updateField("usageFrequency", e.target.value)}
        />
      </FormField>

      <FormField id="skillLevel" label="Skill level (1-10)" required error={errors.skillLevel}>
        <Input
          type="number"
          min={1}
          max={10}
          value={values.skillLevel}
          onChange={(e) => updateField("skillLevel", Number(e.target.value))}
        />
      </FormField>

      <FormField id="observedTasks" label="Observed tasks">
        <TagListEditor
          values={values.observedTasks}
          onChange={(next) => updateField("observedTasks", next)}
          placeholder="Add a task and press Enter"
        />
      </FormField>

      <FormField id="workarounds" label="Workarounds / manual adaptations">
        <TagListEditor
          values={values.workarounds}
          onChange={(next) => updateField("workarounds", next)}
          placeholder="Add a workaround and press Enter"
        />
      </FormField>

      <FormField id="amplifiedFrictions" label="Frictions this user amplifies">
        <TagListEditor
          values={values.amplifiedFrictions}
          onChange={(next) => updateField("amplifiedFrictions", next)}
          placeholder="Add a friction and press Enter"
        />
      </FormField>

      <FormField
        id="extremeNeed"
        label="Extreme need detected"
        required
        error={errors.extremeNeed}
      >
        <TextArea
          value={values.extremeNeed}
          onChange={(e) => updateField("extremeNeed", e.target.value)}
        />
      </FormField>

      <FormField id="generalizationHypothesis" label="Generalization hypothesis">
        <TextArea
          value={values.generalizationHypothesis}
          onChange={(e) => updateField("generalizationHypothesis", e.target.value)}
        />
      </FormField>

      <FormField id="evidence" label="Evidence (links, photo notes, timestamps)">
        <TagListEditor
          values={values.evidence}
          onChange={(next) => updateField("evidence", next)}
          placeholder="Add a link or note and press Enter"
        />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="w-auto">
          Cancel
        </Button>
        <Button type="submit" className="w-auto">
          Save
        </Button>
      </div>
    </form>
  );
}
