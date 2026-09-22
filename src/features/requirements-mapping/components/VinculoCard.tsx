// features/requirements-mapping/components/VinculoCard.tsx
// Figma: "Lista de vínculos — cada fila une un insight y un segmento con
// sus requisitos, prioridad y estado de validación, con acciones de
// editar y eliminar." flex-col on mobile / flex-row on larger screens so
// the same component IS the mobile "card" — no separate mobile layout.

import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import type { Insight, Segmento } from "../../../types/common";
import type { Prioridad, Requisito } from "../types";
import { ActionsMenu } from "./ActionsMenu";

const PRIORIDAD_VARIANT: Record<Prioridad, "danger" | "warning" | "neutral"> = {
  alta: "danger",
  media: "warning",
  baja: "neutral",
};

const ESTADO_VARIANT: Record<Requisito["estadoValidacion"], "success" | "warning" | "danger"> = {
  validado: "success",
  pendiente: "warning",
  rechazado: "danger",
};

export interface VinculoCardProps {
  requisito: Requisito;
  insight?: Insight;
  segmento?: Segmento;
  prioridadAjustada: Prioridad;
  onEdit: () => void;
  onDelete: () => void;
}

export function VinculoCard({
  requisito,
  insight,
  segmento,
  prioridadAjustada,
  onEdit,
  onDelete,
}: VinculoCardProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {insight && <Badge variant="neutral">Insight: {insight.descripcion}</Badge>}
          {segmento && <Badge variant="neutral">Segmento: {segmento.nombre}</Badge>}
          <Badge variant="neutral">{requisito.tipo === "funcional" ? "Funcional" : "UX"}</Badge>
        </div>

        <p className="text-body-sm text-ink-primary">{requisito.descripcion}</p>

        <p className="text-body-xs text-ink-secondary">
          → Decisión de arquitectura: {requisito.decisionArquitectura}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={PRIORIDAD_VARIANT[prioridadAjustada]}>
            Prioridad: {prioridadAjustada}
          </Badge>
          <Badge variant={ESTADO_VARIANT[requisito.estadoValidacion]}>
            {requisito.estadoValidacion}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end sm:justify-start">
        <ActionsMenu label={requisito.descripcion} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </Card>
  );
}
