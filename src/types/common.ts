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

// Segmento y AsignacionSegmento (interfaz 5, Roper Dynagram) se agregan
// aparte por Troy Moreno, en su propio commit — ver blueprint.md §4.1.
