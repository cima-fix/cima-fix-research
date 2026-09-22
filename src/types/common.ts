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
//
// A propósito NO hay un campo de "% observado" aquí: se calcula en
// runtime contando AsignacionSegmento por segmentoId sobre el total
// (ver features/roper-dynagram/stats.ts), para que nunca se desincronice
// de los registros reales — la rúbrica exige que la rueda se recalcule
// sola al agregar o editar una asignación.
export interface Segmento {
  id: string;
  nombre: string;
  // Valores / estilo de vida que definen el segmento, ej. "Seguridad, pragmatismo"
  // (investigacion_de_usuarios.md §5: "valores asociados").
  criterio: string;
  requisitoUX: string; // panel dinámico: requisito UX derivado
  funcionalidadClave: string; // panel dinámico: funcionalidad clave
  tonoSistema: string; // panel dinámico: tono del sistema
}

export interface AsignacionSegmento {
  id: string;
  // Usuario entrevistado. Mismo id que Insight.sujetoId cuando se trata
  // de la misma persona (contrato acordado con interfaz 4 e interfaz 6).
  sujetoId: string;
  segmentoId: string;
  evidencia: string;
}
