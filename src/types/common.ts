// Este archivo es una excepción puntual al aislamiento por carpeta de blueprint.md §4.
// Cada tipo aquí tiene un único dueño que lo escribe; los demás solo lo leen.
// Ver blueprint.md §4.1 para el contrato completo.

// Dueño: interfaz 4 (Empathy Map) — Emir Alcantar
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

// Dueño: interfaz 5 (Roper Dynagram) — Troy Moreno
export interface Segmento {
  id: string;
  nombre: string;
  criterio: string;
  requisitoUX: string;
  funcionalidadClave: string;
  tonoSistema: string;
}

// Dueño: interfaz 5 (Roper Dynagram) — Troy Moreno
export interface AsignacionSegmento {
  id: string;
  sujetoId: string;
  segmentoId: string;
  evidencia: string;
}
