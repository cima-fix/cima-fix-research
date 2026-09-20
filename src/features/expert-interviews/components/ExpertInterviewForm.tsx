// features/expert-interviews/components/ExpertInterviewForm.tsx
// Formulario de creación/edición de una entrevista a experto.
// Cubre los seis grupos de campos de investigacion_de_usuarios.md §1.

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { addToList, removeFromList, updateInList } from "../../../lib/list";
import { TagListEditor } from "./TagListEditor";
import type {
  ExpertInterview,
  MedioEntrevista,
  PreguntaRespuesta,
  Referencia,
} from "../types";

const EMPTY_FORM: Omit<ExpertInterview, "id"> = {
  perfil: {
    alias: "",
    rol: "",
    dominio: "",
    aniosExperiencia: 0,
    organizacion: "",
    fecha: "",
    medio: "remoto",
  },
  guion: [],
  complejidadTecnica: {
    conceptosClave: [],
    jergaDelDominio: [],
    dependenciasEntreComponentes: [],
    actoresDelEcosistema: [],
  },
  restriccionesYRiesgos: [],
  referencias: [],
  notas: "",
  siguientesPasos: "",
};

export interface ExpertInterviewFormProps {
  initialValue: ExpertInterview | null;
  onSubmit: (data: Omit<ExpertInterview, "id">) => void;
  onCancel: () => void;
}

// --- Validación ---
// NOTA: asume que FormField acepta `error?: string` (blueprint.md §6: "label +
// mensaje de error"). Ajustar el nombre de la prop si el componente real usa
// otro distinto.

interface PerfilErrors {
  alias?: string;
  rol?: string;
  dominio?: string;
  aniosExperiencia?: string;
  organizacion?: string;
  fecha?: string;
}

interface FormErrors {
  perfil: PerfilErrors;
  guion: Record<string, { pregunta?: string; respuesta?: string }>;
  referencias: Record<string, { descripcion?: string }>;
}

const NO_ERRORS: FormErrors = { perfil: {}, guion: {}, referencias: {} };

function validate(data: Omit<ExpertInterview, "id">): FormErrors {
  const perfil: PerfilErrors = {};
  if (!data.perfil.alias.trim()) perfil.alias = "El alias es obligatorio.";
  if (!data.perfil.rol.trim()) perfil.rol = "El rol es obligatorio.";
  if (!data.perfil.dominio.trim()) perfil.dominio = "El dominio es obligatorio.";
  if (!Number.isFinite(data.perfil.aniosExperiencia) || data.perfil.aniosExperiencia < 0) {
    perfil.aniosExperiencia = "Debe ser un número mayor o igual a 0.";
  }
  if (!data.perfil.organizacion.trim()) {
    perfil.organizacion = "La organización es obligatoria.";
  }
  if (!data.perfil.fecha) perfil.fecha = "La fecha es obligatoria.";

  const guion: FormErrors["guion"] = {};
  for (const qa of data.guion) {
    const entry: { pregunta?: string; respuesta?: string } = {};
    if (!qa.pregunta.trim()) entry.pregunta = "La pregunta es obligatoria.";
    if (!qa.respuesta.trim()) entry.respuesta = "La respuesta es obligatoria.";
    if (entry.pregunta || entry.respuesta) guion[qa.id] = entry;
  }

  const referencias: FormErrors["referencias"] = {};
  for (const ref of data.referencias) {
    if (!ref.descripcion.trim()) {
      referencias[ref.id] = { descripcion: "La descripción es obligatoria." };
    }
  }

  return { perfil, guion, referencias };
}

function hasErrors(errors: FormErrors): boolean {
  return (
    Object.keys(errors.perfil).length > 0 ||
    Object.keys(errors.guion).length > 0 ||
    Object.keys(errors.referencias).length > 0
  );
}

export function ExpertInterviewForm({
  initialValue,
  onSubmit,
  onCancel,
}: ExpertInterviewFormProps) {
  const [form, setForm] = useState<Omit<ExpertInterview, "id">>(() =>
    initialValue
      ? {
          perfil: initialValue.perfil,
          guion: initialValue.guion,
          complejidadTecnica: initialValue.complejidadTecnica,
          restriccionesYRiesgos: initialValue.restriccionesYRiesgos,
          referencias: initialValue.referencias,
          notas: initialValue.notas,
          siguientesPasos: initialValue.siguientesPasos,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSubmit(form);
  }

  // --- Guion dinámico (pregunta → respuesta) ---

  function addQuestion() {
    setForm((prev) => ({
      ...prev,
      guion: addToList<PreguntaRespuesta>(prev.guion, {
        pregunta: "",
        respuesta: "",
        esCitaTextualClave: false,
      }),
    }));
  }

  function updateQuestion(id: string, updates: Partial<Omit<PreguntaRespuesta, "id">>) {
    setForm((prev) => ({
      ...prev,
      guion: updateInList(prev.guion, id, updates),
    }));
  }

  function removeQuestion(id: string) {
    setForm((prev) => ({ ...prev, guion: removeFromList(prev.guion, id) }));
  }

  // --- Referencias ---

  function addReferencia() {
    setForm((prev) => ({
      ...prev,
      referencias: addToList<Referencia>(prev.referencias, {
        descripcion: "",
        url: "",
      }),
    }));
  }

  function updateReferencia(id: string, updates: Partial<Omit<Referencia, "id">>) {
    setForm((prev) => ({
      ...prev,
      referencias: updateInList(prev.referencias, id, updates),
    }));
  }

  function removeReferencia(id: string) {
    setForm((prev) => ({
      ...prev,
      referencias: removeFromList(prev.referencias, id),
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      {/* Perfil del experto */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Perfil del experto
        </legend>

        <FormField id="alias" label="Alias" required error={errors.perfil.alias}>
          <Input
            value={form.perfil.alias}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, alias: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="rol" label="Rol" required error={errors.perfil.rol}>
          <Input
            value={form.perfil.rol}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, rol: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="dominio" label="Dominio" required error={errors.perfil.dominio}>
          <Input
            value={form.perfil.dominio}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, dominio: e.target.value } }))
            }
          />
        </FormField>

        <FormField
          id="anios-experiencia"
          label="Años de experiencia"
          required
          error={errors.perfil.aniosExperiencia}
        >
          <Input
            type="number"
            min={0}
            value={form.perfil.aniosExperiencia}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                perfil: { ...p.perfil, aniosExperiencia: Number(e.target.value) },
              }))
            }
          />
        </FormField>

        <FormField
          id="organizacion"
          label="Organización"
          required
          error={errors.perfil.organizacion}
        >
          <Input
            value={form.perfil.organizacion}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                perfil: { ...p.perfil, organizacion: e.target.value },
              }))
            }
          />
        </FormField>

        <FormField id="fecha" label="Fecha" required error={errors.perfil.fecha}>
          <Input
            type="date"
            value={form.perfil.fecha}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, fecha: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="medio" label="Medio" required>
          <Select
            value={form.perfil.medio}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                perfil: { ...p.perfil, medio: e.target.value as MedioEntrevista },
              }))
            }
          >
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
          </Select>
        </FormField>
      </fieldset>

      {/* Guion dinámico */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Guion (pregunta → respuesta)
        </legend>

        {form.guion.map((qa) => (
          <Card key={qa.id} className="flex flex-col gap-2">
            <FormField id={`pregunta-${qa.id}`} label="Pregunta">
              <Input
                value={qa.pregunta}
                onChange={(e) => updateQuestion(qa.id, { pregunta: e.target.value })}
              />
            </FormField>
            <FormField id={`respuesta-${qa.id}`} label="Respuesta">
              <TextArea
                value={qa.respuesta}
                onChange={(e) => updateQuestion(qa.id, { respuesta: e.target.value })}
              />
            </FormField>
            <label className="flex items-center gap-2 text-body-sm text-ink-primary">
              <input
                type="checkbox"
                checked={qa.esCitaTextualClave}
                onChange={(e) =>
                  updateQuestion(qa.id, { esCitaTextualClave: e.target.checked })
                }
              />
              Cita textual clave
            </label>
            <Button
              type="button"
              variant="danger"
              className="w-auto self-end"
              onClick={() => removeQuestion(qa.id)}
            >
              Eliminar pregunta
            </Button>
          </Card>
        ))}

        <Button type="button" variant="secondary" className="w-auto" onClick={addQuestion}>
          Agregar pregunta
        </Button>
      </fieldset>

      {/* Mapa de complejidad técnica */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Mapa de complejidad técnica
        </legend>

        <TagListEditor
          label="Conceptos clave"
          values={form.complejidadTecnica.conceptosClave}
          onChange={(next) =>
            setForm((p) => ({
              ...p,
              complejidadTecnica: { ...p.complejidadTecnica, conceptosClave: next },
            }))
          }
        />
        <TagListEditor
          label="Jerga del dominio"
          values={form.complejidadTecnica.jergaDelDominio}
          onChange={(next) =>
            setForm((p) => ({
              ...p,
              complejidadTecnica: { ...p.complejidadTecnica, jergaDelDominio: next },
            }))
          }
        />
        <TagListEditor
          label="Dependencias entre componentes"
          values={form.complejidadTecnica.dependenciasEntreComponentes}
          onChange={(next) =>
            setForm((p) => ({
              ...p,
              complejidadTecnica: {
                ...p.complejidadTecnica,
                dependenciasEntreComponentes: next,
              },
            }))
          }
        />
        <TagListEditor
          label="Actores del ecosistema"
          values={form.complejidadTecnica.actoresDelEcosistema}
          onChange={(next) =>
            setForm((p) => ({
              ...p,
              complejidadTecnica: { ...p.complejidadTecnica, actoresDelEcosistema: next },
            }))
          }
        />
      </fieldset>

      {/* Restricciones y riesgos */}
      <fieldset>
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Restricciones y riesgos
        </legend>
        <TagListEditor
          label="Restricciones / riesgos técnicos"
          values={form.restriccionesYRiesgos}
          onChange={(next) => setForm((p) => ({ ...p, restriccionesYRiesgos: next }))}
        />
      </fieldset>

      {/* Referencias */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Referencias / fuentes recomendadas
        </legend>

        {form.referencias.map((ref) => (
          <Card key={ref.id} className="flex flex-col gap-2">
            <FormField id={`ref-descripcion-${ref.id}`} label="Descripción">
              <Input
                value={ref.descripcion}
                onChange={(e) =>
                  updateReferencia(ref.id, { descripcion: e.target.value })
                }
              />
            </FormField>
            <FormField id={`ref-url-${ref.id}`} label="URL (opcional)">
              <Input
                type="url"
                value={ref.url ?? ""}
                onChange={(e) => updateReferencia(ref.id, { url: e.target.value })}
              />
            </FormField>
            <Button
              type="button"
              variant="danger"
              className="w-auto self-end"
              onClick={() => removeReferencia(ref.id)}
            >
              Eliminar referencia
            </Button>
          </Card>
        ))}

        <Button type="button" variant="secondary" className="w-auto" onClick={addReferencia}>
          Agregar referencia
        </Button>
      </fieldset>

      {/* Notas y siguientes pasos */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-sm font-medium text-ink-primary mb-1">
          Notas y siguientes pasos
        </legend>
        <FormField id="notas" label="Notas">
          <TextArea
            value={form.notas}
            onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
          />
        </FormField>
        <FormField id="siguientes-pasos" label="Siguientes pasos">
          <TextArea
            value={form.siguientesPasos}
            onChange={(e) => setForm((p) => ({ ...p, siguientesPasos: e.target.value }))}
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