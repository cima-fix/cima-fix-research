// This file is a one-off exception to the per-folder isolation from blueprint.md §4.
// Each type here has a single owner who writes it; everyone else only reads it.
// See blueprint.md §4.1 for the full contract.

// Owner: interface 4 (Empathy Map) — Emir Alcantar
export interface Insight {
  id: string;
  sujetoId?: string;
  descripcion: string;
  tipo:
    | "usabilidad"
    | "necesidad-oculta"
    | "carga-cognitiva"
    | "adaptacion-manual"
    | "innovacion-potencial";
  prioridad: "alta" | "media" | "baja";
}

// Owner: interface 5 (Roper Dynagram) — Troy Moreno
//
// There's deliberately NO "% observed" field here: it's computed at
// runtime by counting AsignacionSegmento per segmentoId over the total
// (see features/roper-dynagram/stats.ts), so it never goes out of sync
// with the real records — the rubric requires the wheel to recalculate
// on its own when an assignment is added or edited.
export interface Segmento {
  id: string;
  nombre: string;
  // Values / lifestyle that define the segment, e.g. "Security, pragmatism"
  // (investigacion_de_usuarios.md §5: "associated values").
  criterio: string;
  requisitoUX: string; // dynamic panel: derived UX requirement
  funcionalidadClave: string; // dynamic panel: key functionality
  tonoSistema: string; // dynamic panel: system tone
}

export interface AsignacionSegmento {
  id: string;
  // Interviewed user. Same id as Insight.sujetoId when it's the same
  // person (contract agreed with interface 4 and interface 6).
  sujetoId: string;
  segmentoId: string;
  evidencia: string;
}
