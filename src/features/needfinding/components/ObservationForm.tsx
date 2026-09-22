// features/needfinding/components/ObservationForm.tsx
//
// SUPUESTOS SIN VERIFICAR (ajustar contra el código real de components/ui/):
// - `FormField` envuelve un único hijo (Input/TextArea/Select) y le inyecta
//   id/required/aria-* automáticamente, como describe blueprint.md §6. Aquí
//   solo se le pasan `label` y `error`.
// - `Select` recibe <option> como children (patrón de select nativo), no un
//   prop `options`.
// - `Input`/`TextArea`/`Select` son componentes controlados con `value` y
//   `onChange` estilo React estándar.

import { useState, type FormEvent } from "react";
import { Card } from "../../../components/ui/Card.tsx";
import { FormField } from "../../../components/ui/FormField.tsx";
import { Input } from "../../../components/ui/Input.tsx";
import { TextArea } from "../../../components/ui/TextArea.tsx";
import { Select } from "../../../components/ui/Select.tsx";
import { Button } from "../../../components/ui/Button.tsx";
import { cn } from "../../../lib/cn.ts";
import {
  EMPTY_NEEDFINDING_FORM,
  type NeedfindingFormValues,
  type NeedfindingObservation,
} from "../types.ts";

interface ObservationFormProps {
  /** Observación en edición, o null/undefined para "nuevo registro". */
  initialValues?: NeedfindingObservation | null;
  onSubmit: (values: NeedfindingFormValues) => void;
  onCancelEdit: () => void;
  className?: string;
}

type FormErrors = Partial<Record<keyof NeedfindingFormValues, string>>;

const REQUIRED_FIELDS: (keyof NeedfindingFormValues)[] = [
  "location",
  "date",
  "activity",
];

function validate(values: NeedfindingFormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!values[field]?.trim()) {
      errors[field] = "Este campo es obligatorio.";
    }
  }
  return errors;
}

export function ObservationForm({
  initialValues,
  onSubmit,
  onCancelEdit,
  className,
}: ObservationFormProps) {
  const [values, setValues] = useState<NeedfindingFormValues>(
    initialValues ?? EMPTY_NEEDFINDING_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(initialValues);

  function setField<K extends keyof NeedfindingFormValues>(
    field: K,
    value: NeedfindingFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(values);
    if (!isEditing) setValues(EMPTY_NEEDFINDING_FORM);
    setErrors({});
  }

  return (
    <Card className={cn("flex flex-col gap-6", className)}>
      <div>
        <h2 className="text-heading-3">
          {isEditing ? "Editar observación" : "Nueva observación"}
        </h2>
        <p className="text-body-sm text-neutral-500">
          Contexto, capas del iceberg y clasificación del dato para un
          registro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Contexto de observación — 2 columnas en desktop, 1 en mobile */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="location" label="Lugar" error={errors.location}>
            <Input
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="Ej. Biblioteca central, planta baja"
            />
          </FormField>
          <FormField id="date" label="Fecha" error={errors.date}>
            <Input
              type="date"
              value={values.date}
              onChange={(e) => setField("date", e.target.value)}
            />
          </FormField>
          <FormField id="duration" label="Duración">
            <Input
              value={values.duration}
              onChange={(e) => setField("duration", e.target.value)}
              placeholder="Ej. 45 min"
            />
          </FormField>
          <FormField id="activity" label="Actividad observada" error={errors.activity}>
            <Input
              value={values.activity}
              onChange={(e) => setField("activity", e.target.value)}
              placeholder="Ej. Reservar una sala de estudio"
            />
          </FormField>
        </div>

        {/* Iceberg: superficie vs. profundidad */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="obviousNeeds" label="Necesidades obvias (superficie)">
            <TextArea
              rows={4}
              value={values.obviousNeeds}
              onChange={(e) => setField("obviousNeeds", e.target.value)}
              placeholder="Lo que el usuario dice que quiere, feature requests..."
            />
          </FormField>
          <FormField id="hiddenNeeds" label="Necesidades ocultas (profundidad)">
            <TextArea
              rows={4}
              value={values.hiddenNeeds}
              onChange={(e) => setField("hiddenNeeds", e.target.value)}
              placeholder="Frustraciones silenciadas, emociones subyacentes..."
            />
          </FormField>
        </div>

        {/* Dato crudo vs. interpretación — separación explícita exigida por la tarea */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="rawData" label="Dato crudo observado">
            <TextArea
              rows={3}
              value={values.rawData}
              onChange={(e) => setField("rawData", e.target.value)}
              placeholder="Comportamiento observado, sin interpretar."
            />
          </FormField>
          <FormField id="interpretation" label="Interpretación / inferencia">
            <TextArea
              rows={3}
              value={values.interpretation}
              onChange={(e) => setField("interpretation", e.target.value)}
              placeholder="Lo que ese comportamiento sugiere."
            />
          </FormField>
        </div>

        <FormField id="innovationPotential" label="Potencial de innovación" className="max-w-xs">
          <Select
            value={values.innovationPotential}
            onChange={(e) =>
              setField(
                "innovationPotential",
                e.target.value as NeedfindingFormValues["innovationPotential"],
              )
            }
          >
            <option value="bajo">Bajo</option>
            <option value="alto">Alto</option>
          </Select>
        </FormField>

        <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-200 pt-4">
          {isEditing && (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancelar edición
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Guardar cambios" : "Registrar observación"}
          </Button>
        </div>
      </form>
    </Card>
  );
}