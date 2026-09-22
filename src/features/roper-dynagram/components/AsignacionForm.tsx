// features/roper-dynagram/components/AsignacionForm.tsx
// Formulario para asignar un sujeto entrevistado a un segmento, con
// evidencia obligatoria — investigacion_de_usuarios.md §5.

import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { required } from "../../../lib/validation";
import type { AsignacionSegmento, Segmento } from "../../../types/common";
import type { Sujeto } from "../types";

const EMPTY_FORM: Omit<AsignacionSegmento, "id"> = {
  sujetoId: "",
  segmentoId: "",
  evidencia: "",
};

export interface AsignacionFormProps {
  initialValue: AsignacionSegmento | null;
  sujetos: Sujeto[];
  segmentos: Segmento[];
  onSubmit: (data: Omit<AsignacionSegmento, "id">) => void;
  onCancel: () => void;
}

interface FormErrors {
  sujetoId?: string;
  segmentoId?: string;
  evidencia?: string;
}

function validate(data: Omit<AsignacionSegmento, "id">): FormErrors {
  const errors: FormErrors = {};

  if (required(data.sujetoId)) errors.sujetoId = "Selecciona un sujeto.";
  if (required(data.segmentoId)) errors.segmentoId = "Selecciona un segmento.";

  const evidenciaError = required(data.evidencia);
  if (evidenciaError) errors.evidencia = evidenciaError;

  return errors;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

export function AsignacionForm({
  initialValue,
  sujetos,
  segmentos,
  onSubmit,
  onCancel,
}: AsignacionFormProps) {
  const [form, setForm] = useState<Omit<AsignacionSegmento, "id">>(
    initialValue
      ? {
          sujetoId: initialValue.sujetoId,
          segmentoId: initialValue.segmentoId,
          evidencia: initialValue.evidencia,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <FormField
        id="asignacion-sujeto"
        label="Sujeto entrevistado"
        required
        error={errors.sujetoId}
      >
        <Select
          value={form.sujetoId}
          onChange={(e) => setForm((p) => ({ ...p, sujetoId: e.target.value }))}
        >
          <option value="" disabled>
            Selecciona un sujeto
          </option>
          {sujetos.map((sujeto) => (
            <option key={sujeto.id} value={sujeto.id}>
              {sujeto.nombre}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        id="asignacion-segmento"
        label="Segmento"
        required
        error={errors.segmentoId}
      >
        <Select
          value={form.segmentoId}
          onChange={(e) => setForm((p) => ({ ...p, segmentoId: e.target.value }))}
        >
          <option value="" disabled>
            Selecciona un segmento
          </option>
          {segmentos.map((segmento) => (
            <option key={segmento.id} value={segmento.id}>
              {segmento.nombre}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        id="asignacion-evidencia"
        label="Evidencia"
        required
        error={errors.evidencia}
      >
        <TextArea
          value={form.evidencia}
          onChange={(e) => setForm((p) => ({ ...p, evidencia: e.target.value }))}
          placeholder="Qué dijo o hizo este sujeto que sustenta la asignación..."
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" className="w-auto" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="w-auto">
          Guardar
        </Button>
      </div>
    </form>
  );
}
