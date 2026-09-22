// features/needfinding/components/ObservationCard.tsx
//
// SUPUESTO SIN VERIFICAR: se asume que `Button` acepta `variant`/`size` y que
// `Badge` acepta `variant: "success" | "danger" | "warning" | "neutral"` tal
// como los describe blueprint.md §6. Ajustar si la firma real difiere.

import { Card } from "../../../components/ui/Card.tsx";
import { Badge } from "../../../components/ui/Badge.tsx";
import { Button } from "../../../components/ui/Button.tsx";
import { cn } from "../../../lib/cn.ts";
import type { NeedfindingObservation } from "../types.ts";

interface ObservationCardProps {
  observation: NeedfindingObservation;
  onEdit: (observation: NeedfindingObservation) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function ObservationCard({
  observation,
  onEdit,
  onDelete,
  className,
}: ObservationCardProps) {
  const isHighPotential = observation.innovationPotential === "alto";

  return (
    <Card className={cn("flex h-full flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-body-sm font-medium">
            {observation.activity || "Actividad sin título"}
          </p>
          <p className="text-body-xs text-neutral-500">
            {[observation.location, observation.date, observation.duration]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <Badge variant={isHighPotential ? "success" : "neutral"}>
          Potencial {isHighPotential ? "alto" : "bajo"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-body-xs font-medium text-neutral-600">
            Superficie (obvio)
          </p>
          <p className="text-body-sm line-clamp-3">
            {observation.obviousNeeds || "—"}
          </p>
        </div>
        <div>
          <p className="text-body-xs font-medium text-neutral-600">
            Profundidad (oculto)
          </p>
          <p className="text-body-sm line-clamp-3">
            {observation.hiddenNeeds || "—"}
          </p>
        </div>
        <div>
          <p className="text-body-xs font-medium text-neutral-600">
            Dato crudo
          </p>
          <p className="text-body-sm line-clamp-3">
            {observation.rawData || "—"}
          </p>
        </div>
        <div>
          <p className="text-body-xs font-medium text-neutral-600">
            Interpretación
          </p>
          <p className="text-body-sm line-clamp-3">
            {observation.interpretation || "—"}
          </p>
        </div>
      </div>

    <div className="mt-auto flex justify-end gap-2 pt-2">
      <Button
        type="button"
        variant="secondary"
        onClick={() => onEdit(observation)}
      >
        Editar
      </Button>
      <Button
        type="button"
        variant="danger"
        onClick={() => onDelete(observation.id)}
      >
        Eliminar
      </Button>
    </div>
    </Card>
  );
}