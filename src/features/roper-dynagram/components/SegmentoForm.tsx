// features/roper-dynagram/components/SegmentoForm.tsx
// Form for creating/editing a Segmento: name, values/criteria, and
// the three fields that feed the dynamic output panel. The % isn't
// captured here — it's derived at runtime (see ../stats.ts).

import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { required } from "../../../lib/validation";
import type { Segmento } from "../../../types/common";

const EMPTY_FORM: Omit<Segmento, "id"> = {
  nombre: "",
  criterio: "",
  requisitoUX: "",
  funcionalidadClave: "",
  tonoSistema: "",
};

export interface SegmentoFormProps {
  initialValue: Segmento | null;
  onSubmit: (data: Omit<Segmento, "id">) => void;
  onCancel: () => void;
}

interface FormErrors {
  nombre?: string;
  criterio?: string;
  requisitoUX?: string;
  funcionalidadClave?: string;
  tonoSistema?: string;
}

function validate(data: Omit<Segmento, "id">): FormErrors {
  const errors: FormErrors = {};

  const nombreError = required(data.nombre);
  if (nombreError) errors.nombre = nombreError;

  const criterioError = required(data.criterio);
  if (criterioError) errors.criterio = criterioError;

  const requisitoError = required(data.requisitoUX);
  if (requisitoError) errors.requisitoUX = requisitoError;

  const funcionalidadError = required(data.funcionalidadClave);
  if (funcionalidadError) errors.funcionalidadClave = funcionalidadError;

  const tonoError = required(data.tonoSistema);
  if (tonoError) errors.tonoSistema = tonoError;

  return errors;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

export function SegmentoForm({
  initialValue,
  onSubmit,
  onCancel,
}: SegmentoFormProps) {
  const [form, setForm] = useState<Omit<Segmento, "id">>(
    initialValue
      ? {
          nombre: initialValue.nombre,
          criterio: initialValue.criterio,
          requisitoUX: initialValue.requisitoUX,
          funcionalidadClave: initialValue.funcionalidadClave,
          tonoSistema: initialValue.tonoSistema,
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
        id="segmento-nombre"
        label="Nombre del segmento"
        required
        error={errors.nombre}
      >
        <Input
          value={form.nombre}
          onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
          placeholder="Ej. Realists"
        />
      </FormField>

      <FormField
        id="segmento-criterio"
        label="Valores / criterio"
        required
        error={errors.criterio}
      >
        <TextArea
          value={form.criterio}
          onChange={(e) => setForm((p) => ({ ...p, criterio: e.target.value }))}
          placeholder="Ej. Seguridad, pragmatismo"
        />
      </FormField>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Panel dinámico de salida
        </legend>

        <FormField
          id="segmento-requisito-ux"
          label="Requisito UX derivado"
          required
          error={errors.requisitoUX}
        >
          <TextArea
            value={form.requisitoUX}
            onChange={(e) => setForm((p) => ({ ...p, requisitoUX: e.target.value }))}
          />
        </FormField>

        <FormField
          id="segmento-funcionalidad-clave"
          label="Funcionalidad clave"
          required
          error={errors.funcionalidadClave}
        >
          <TextArea
            value={form.funcionalidadClave}
            onChange={(e) =>
              setForm((p) => ({ ...p, funcionalidadClave: e.target.value }))
            }
          />
        </FormField>

        <FormField
          id="segmento-tono"
          label="Tono del sistema"
          required
          error={errors.tonoSistema}
        >
          <TextArea
            value={form.tonoSistema}
            onChange={(e) => setForm((p) => ({ ...p, tonoSistema: e.target.value }))}
          />
        </FormField>
      </fieldset>

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
