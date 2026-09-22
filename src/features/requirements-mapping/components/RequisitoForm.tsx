// features/requirements-mapping/components/RequisitoForm.tsx
// Form for creating/editing a Requisito. insightId/segmentoId are
// pickers over data owned by other interfaces (read-only — blueprint.md
// §4.1); prioridadAjustada isn't captured here, it's computed (see
// ../priority.ts) and shown read-only in the page/table instead.

import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { required } from "../../../lib/validation";
import type { Insight, Segmento } from "../../../types/common";
import type { EstadoValidacion, Prioridad, Requisito, TipoRequisito } from "../types";

const EMPTY_FORM: Omit<Requisito, "id"> = {
  insightId: undefined,
  segmentoId: undefined,
  descripcion: "",
  tipo: "funcional",
  prioridadBase: "media",
  estadoValidacion: "pendiente",
  decisionArquitectura: "",
};

export interface RequisitoFormProps {
  initialValue: Requisito | null;
  insights: Insight[];
  segmentos: Segmento[];
  onSubmit: (data: Omit<Requisito, "id">) => void;
  onCancel: () => void;
}

interface FormErrors {
  descripcion?: string;
  decisionArquitectura?: string;
  vinculo?: string;
}

function validate(data: Omit<Requisito, "id">): FormErrors {
  const errors: FormErrors = {};

  const descripcionError = required(data.descripcion);
  if (descripcionError) errors.descripcion = descripcionError;

  const decisionError = required(data.decisionArquitectura);
  if (decisionError) errors.decisionArquitectura = decisionError;

  // Traceability requires an origin: investigacion_de_usuarios.md §6
  // asks for every requisito to be linked to an insight and/or a segmento.
  if (!data.insightId && !data.segmentoId) {
    errors.vinculo = "Vincula al menos un insight o un segmento";
  }

  return errors;
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

export function RequisitoForm({
  initialValue,
  insights,
  segmentos,
  onSubmit,
  onCancel,
}: RequisitoFormProps) {
  const [form, setForm] = useState<Omit<Requisito, "id">>(
    initialValue
      ? {
          insightId: initialValue.insightId,
          segmentoId: initialValue.segmentoId,
          descripcion: initialValue.descripcion,
          tipo: initialValue.tipo,
          prioridadBase: initialValue.prioridadBase,
          estadoValidacion: initialValue.estadoValidacion,
          decisionArquitectura: initialValue.decisionArquitectura,
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
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Origen (trazabilidad)
        </legend>

        <FormField id="requisito-insight" label="Insight vinculado (Empathy Map)">
          <Select
            value={form.insightId ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, insightId: e.target.value || undefined }))
            }
          >
            <option value="">— Ninguno —</option>
            {insights.map((insight) => (
              <option key={insight.id} value={insight.id}>
                {insight.descripcion} ({insight.tipo})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="requisito-segmento" label="Segmento vinculado (Roper Dynagram)">
          <Select
            value={form.segmentoId ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, segmentoId: e.target.value || undefined }))
            }
          >
            <option value="">— Ninguno —</option>
            {segmentos.map((segmento) => (
              <option key={segmento.id} value={segmento.id}>
                {segmento.nombre}
              </option>
            ))}
          </Select>
        </FormField>

        {errors.vinculo && (
          <p role="alert" className="text-body-xs text-danger">
            {errors.vinculo}
          </p>
        )}
      </fieldset>

      <FormField
        id="requisito-descripcion"
        label="Descripción del requisito"
        required
        error={errors.descripcion}
      >
        <TextArea
          value={form.descripcion}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          placeholder="Ej. El sistema debe mostrar un estado intermedio explícito antes de marcar un reporte como resuelto"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField id="requisito-tipo" label="Tipo">
          <Select
            value={form.tipo}
            onChange={(e) =>
              setForm((p) => ({ ...p, tipo: e.target.value as TipoRequisito }))
            }
          >
            <option value="funcional">Funcional</option>
            <option value="ux">UX / no funcional</option>
          </Select>
        </FormField>

        <FormField id="requisito-prioridad" label="Prioridad (juicio propio)">
          <Select
            value={form.prioridadBase}
            onChange={(e) =>
              setForm((p) => ({ ...p, prioridadBase: e.target.value as Prioridad }))
            }
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </Select>
        </FormField>

        <FormField id="requisito-estado" label="Estado de validación">
          <Select
            value={form.estadoValidacion}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                estadoValidacion: e.target.value as EstadoValidacion,
              }))
            }
          >
            <option value="pendiente">Pendiente</option>
            <option value="validado">Validado</option>
            <option value="rechazado">Rechazado</option>
          </Select>
        </FormField>
      </div>

      <FormField
        id="requisito-decision"
        label="Decisión de arquitectura derivada"
        required
        error={errors.decisionArquitectura}
      >
        <TextArea
          value={form.decisionArquitectura}
          onChange={(e) =>
            setForm((p) => ({ ...p, decisionArquitectura: e.target.value }))
          }
          placeholder="Ej. Tabla seguimiento con estado enum + endpoint de notificación incremental"
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
