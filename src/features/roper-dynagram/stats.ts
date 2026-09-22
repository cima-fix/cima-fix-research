// features/roper-dynagram/stats.ts
// Derives each segment's observed % from the real assignments loaded.
// It's deliberately not stored as a fixed field on Segmento
// (see types/common.ts) — it's recalculated here every time the
// segments or assignments change, so the wheel never goes out of
// sync (investigacion_de_usuarios.md §5, "ERROR COMÚN").

import type { AsignacionSegmento, Segmento } from "../../types/common";

export interface SegmentStat {
  segmento: Segmento;
  conteo: number;
  porcentaje: number; // 0–1, over the total real assignments
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
