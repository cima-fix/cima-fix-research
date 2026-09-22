// features/roper-dynagram/stats.ts
// Deriva el % observado de cada segmento a partir de las asignaciones
// reales cargadas. A propósito no se guarda como campo fijo en Segmento
// (ver types/common.ts) — se recalcula aquí cada vez que cambian los
// segmentos o las asignaciones, para que la rueda nunca quede
// desincronizada (investigacion_de_usuarios.md §5, "ERROR COMÚN").

import type { AsignacionSegmento, Segmento } from "../../types/common";

export interface SegmentStat {
  segmento: Segmento;
  conteo: number;
  porcentaje: number; // 0–1, sobre el total de asignaciones reales
}

export function computeSegmentStats(
  segmentos: Segmento[],
  asignaciones: AsignacionSegmento[],
): SegmentStat[] {
  const total = asignaciones.length;

  return segmentos.map((segmento) => {
    const conteo = asignaciones.filter(
      (asignacion) => asignacion.segmentoId === segmento.id,
    ).length;

    return {
      segmento,
      conteo,
      porcentaje: total > 0 ? conteo / total : 0,
    };
  });
}
