// features/requirements-mapping/types.ts
// Local data model for the "Mapeo de Requerimientos" interface —
// investigacion_de_usuarios.md §6. Insight and Segmento live in
// types/common.ts (contract from blueprint.md §4.1); this file only
// adds what is exclusive to this interface.

import type { Identifiable } from "../../lib/list";

export type TipoRequisito = "funcional" | "ux";

export type Prioridad = "alta" | "media" | "baja";

export type EstadoValidacion = "validado" | "pendiente" | "rechazado";

export interface Requisito extends Identifiable {
  // Links to interface 4 and interface 5 data — read-only references
  // (blueprint.md §4.1). Both optional: a requirement can come from
  // an insight, a segment, or both.
  insightId?: string;
  segmentoId?: string;

  descripcion: string;
  tipo: TipoRequisito;

  // Priority as this interface's own judgment when the requirement is
  // captured. The "ley embebida" (see ./priority.ts) layers an
  // adjusted priority on top of this one — it's never overwritten by
  // the recalculation, only shown alongside it, so the person's
  // original call is never silently lost.
  prioridadBase: Prioridad;

  estadoValidacion: EstadoValidacion;

  // Traceability view: insight/segmento → requisito → decisión de
  // arquitectura (investigacion_de_usuarios.md §6).
  decisionArquitectura: string;
}
