// features/expert-interviews/components/ExpertInterviewForm.tsx
// Formulario de creación/edición de una entrevista a experto.
// Cubre los seis grupos de campos de investigacion_de_usuarios.md §1.

import { useState } from "react";
import { Button } from "../../../components/ui/Button.tsx";
import { Card } from "../../../components/ui/Card.tsx";
import { FormField } from "../../../components/ui/FormField.tsx";
import { Input } from "../../../components/ui/Input.tsx";
import { Select } from "../../../components/ui/Select.tsx";
import { TextArea } from "../../../components/ui/TextArea.tsx";
import { addToList, removeFromList, updateInList } from "../../../lib/list.ts";
import { TagListEditor } from "./TagListEditor.tsx";
import type {
  ExpertInterview,
  MedioEntrevista,
  PreguntaRespuesta,
  Referencia,
} from "../types.ts";

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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

        <FormField id="alias" label="Alias" required>
          <Input
            value={form.perfil.alias}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, alias: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="rol" label="Rol" required>
          <Input
            value={form.perfil.rol}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, rol: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="dominio" label="Dominio" required>
          <Input
            value={form.perfil.dominio}
            onChange={(e) =>
              setForm((p) => ({ ...p, perfil: { ...p.perfil, dominio: e.target.value } }))
            }
          />
        </FormField>

        <FormField id="anios-experiencia" label="Años de experiencia" required>
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

        <FormField id="organizacion" label="Organización" required>
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

        <FormField id="fecha" label="Fecha" required>
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