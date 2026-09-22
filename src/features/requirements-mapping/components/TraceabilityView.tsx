// features/requirements-mapping/components/TraceabilityView.tsx
// investigacion_de_usuarios.md §6: "Vista de trazabilidad: insight →
// requisito → decisión de arquitectura." Groups requisitos by their
// origin (insight or segmento) so the chain is readable top to bottom,
// instead of a flat table where the link has to be found column by column.

import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import type { Insight, Segmento } from "../../../types/common";
import type { Prioridad, Requisito } from "../types";

export interface TraceabilityViewProps {
  requisitos: Requisito[];
  insights: Insight[];
  segmentos: Segmento[];
  prioridadAjustadaPorId: Map<string, Prioridad>;
}

const PRIORIDAD_VARIANT: Record<Prioridad, "danger" | "warning" | "neutral"> = {
  alta: "danger",
  media: "warning",
  baja: "neutral",
};

function RequisitoChain({
  requisito,
  prioridadAjustada,
}: {
  requisito: Requisito;
  prioridadAjustada: Prioridad;
}) {
  return (
    <li className="flex flex-col gap-1 border-l-2 border-border pl-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body-sm font-medium text-ink-primary">
          {requisito.descripcion}
        </span>
        <Badge variant="neutral">{requisito.tipo === "funcional" ? "Funcional" : "UX"}</Badge>
        <Badge variant={PRIORIDAD_VARIANT[prioridadAjustada]}>
          Prioridad ajustada: {prioridadAjustada}
        </Badge>
      </div>
      <p className="text-body-xs text-ink-secondary">
        → Decisión de arquitectura: {requisito.decisionArquitectura}
      </p>
    </li>
  );
}

export function TraceabilityView({
  requisitos,
  insights,
  segmentos,
  prioridadAjustadaPorId,
}: TraceabilityViewProps) {
  const requisitosPorInsight = new Map<string, Requisito[]>();
  const requisitosPorSegmento = new Map<string, Requisito[]>();
  const sinVinculo: Requisito[] = [];

  for (const requisito of requisitos) {
    if (requisito.insightId) {
      const lista = requisitosPorInsight.get(requisito.insightId) ?? [];
      lista.push(requisito);
      requisitosPorInsight.set(requisito.insightId, lista);
    }
    if (requisito.segmentoId) {
      const lista = requisitosPorSegmento.get(requisito.segmentoId) ?? [];
      lista.push(requisito);
      requisitosPorSegmento.set(requisito.segmentoId, lista);
    }
    if (!requisito.insightId && !requisito.segmentoId) {
      sinVinculo.push(requisito);
    }
  }

  const insightsConRequisitos = insights.filter((i) => requisitosPorInsight.has(i.id));
  const segmentosConRequisitos = segmentos.filter((s) => requisitosPorSegmento.has(s.id));

  if (requisitos.length === 0) {
    return (
      <p className="text-body-sm text-ink-secondary">
        Todavía no hay requisitos vinculados para trazar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {insightsConRequisitos.map((insight) => (
        <Card key={`insight-${insight.id}`} className="flex flex-col gap-2">
          <p className="text-body-sm font-semibold text-ink-primary">
            Insight: {insight.descripcion}
          </p>
          <ul className="flex flex-col gap-2">
            {requisitosPorInsight.get(insight.id)!.map((requisito) => (
              <RequisitoChain
                key={requisito.id}
                requisito={requisito}
                prioridadAjustada={prioridadAjustadaPorId.get(requisito.id) ?? requisito.prioridadBase}
              />
            ))}
          </ul>
        </Card>
      ))}

      {segmentosConRequisitos.map((segmento) => (
        <Card key={`segmento-${segmento.id}`} className="flex flex-col gap-2">
          <p className="text-body-sm font-semibold text-ink-primary">
            Segmento: {segmento.nombre}
          </p>
          <ul className="flex flex-col gap-2">
            {requisitosPorSegmento.get(segmento.id)!.map((requisito) => (
              <RequisitoChain
                key={requisito.id}
                requisito={requisito}
                prioridadAjustada={prioridadAjustadaPorId.get(requisito.id) ?? requisito.prioridadBase}
              />
            ))}
          </ul>
        </Card>
      ))}

      {sinVinculo.length > 0 && (
        <Card className="flex flex-col gap-2 border-danger/40">
          <p className="text-body-sm font-semibold text-danger">
            Sin vínculo (revisar — no debería pasar, el formulario lo exige)
          </p>
          <ul className="flex flex-col gap-2">
            {sinVinculo.map((requisito) => (
              <RequisitoChain
                key={requisito.id}
                requisito={requisito}
                prioridadAjustada={prioridadAjustadaPorId.get(requisito.id) ?? requisito.prioridadBase}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
