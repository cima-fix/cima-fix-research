// features/requirements-mapping/priority.ts
//
// "Ley embebida" (investigacion_de_usuarios.md §6, blueprint.md §4.1):
// when a parameter changes — the size of a segment (share of real
// assignments in Roper Dynagram) or the priority of a linked insight
// (Empathy Map) — each requirement's ADJUSTED priority recalculates on
// its own. Deliberately not stored on the requirement: it's derived on
// every render from the real data loaded, same as roper-dynagram/stats.ts
// derives the observed % instead of storing it — so it never goes out
// of sync.
//
// Rule: the adjusted priority is the highest among (a) the person's own
// judgment captured when creating the requirement (prioridadBase), (b)
// how large the linked segment is, and (c) the priority of the linked
// insight. It never drops below prioridadBase — it only goes up when the
// linked segment or insight outweighs what the person anticipated when
// capturing it.
//
// computePrioridadConCausa also returns WHICH signal won and why, in
// readable text — that's what feeds the recalculation notice (Figma:
// "informs automatic priority changes and what caused them").

import type { AsignacionSegmento, Insight, Segmento } from "../../types/common";
import type { Prioridad, Requisito } from "./types";

const PESO: Record<Prioridad, number> = { baja: 1, media: 2, alta: 3 };
const DESDE_PESO: Prioridad[] = ["baja", "media", "alta"];

export type CausaPrioridad = "base" | "segmento" | "insight";

export interface PrioridadConCausa {
  prioridad: Prioridad;
  causa: CausaPrioridad;
  detalle: string;
}

function segmentoPeso(
  segmentoId: string | undefined,
  asignaciones: AsignacionSegmento[],
): { peso: number; porcentaje: number } {
  if (!segmentoId) return { peso: 0, porcentaje: 0 };

  const total = asignaciones.length;
  if (total === 0) return { peso: 0, porcentaje: 0 };

  const conteo = asignaciones.filter((a) => a.segmentoId === segmentoId).length;
  const porcentaje = conteo / total;

  // Same threshold the Roper Dynagram wheel implicitly uses: a segment
  // with 40%+ of the real assignments is a dominant segment.
  const peso = porcentaje >= 0.4 ? 3 : porcentaje >= 0.15 ? 2 : porcentaje > 0 ? 1 : 0;
  return { peso, porcentaje };
}

export function computePrioridadConCausa(
  requisito: Pick<Requisito, "prioridadBase" | "insightId" | "segmentoId">,
  asignaciones: AsignacionSegmento[],
  segmentosPorId: Map<string, Segmento>,
  insightsPorId: Map<string, Insight>,
): PrioridadConCausa {
  const segmento = requisito.segmentoId ? segmentosPorId.get(requisito.segmentoId) : undefined;
  const insight = requisito.insightId ? insightsPorId.get(requisito.insightId) : undefined;

  const { peso: pesoSegmento, porcentaje } = segmentoPeso(requisito.segmentoId, asignaciones);
  const pesoInsight = insight ? PESO[insight.prioridad] : 0;
  const pesoBase = PESO[requisito.prioridadBase];

  const candidatos: { peso: number; causa: CausaPrioridad; detalle: string }[] = [
    {
      peso: pesoBase,
      causa: "base",
      detalle: "prioridad propia capturada al crear el requisito",
    },
  ];

  if (pesoSegmento > 0 && segmento) {
    candidatos.push({
      peso: pesoSegmento,
      causa: "segmento",
      detalle: `el segmento "${segmento.nombre}" concentra ${Math.round(porcentaje * 100)}% de las asignaciones reales`,
    });
  }

  if (pesoInsight > 0 && insight) {
    candidatos.push({
      peso: pesoInsight,
      causa: "insight",
      detalle: `el insight vinculado tiene prioridad "${insight.prioridad}"`,
    });
  }

  const ganador = candidatos.reduce((mejor, actual) =>
    actual.peso > mejor.peso ? actual : mejor,
  );

  return {
    prioridad: DESDE_PESO[ganador.peso - 1] ?? requisito.prioridadBase,
    causa: ganador.causa,
    detalle: ganador.detalle,
  };
}
