// features/requirements-mapping/components/RecalculationBanner.tsx
// Figma: "Aviso de recálculo — informa cambios automáticos de prioridad
// y qué fue lo que los provocó." Without this, the "ley embebida" is
// invisible unless someone happens to notice a badge changed color —
// this turns it into a visible event the person can actually read.

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { Prioridad } from "../types";

export interface RecalculoCambio {
  requisitoId: string;
  descripcion: string;
  anterior: Prioridad;
  actual: Prioridad;
  detalle: string;
}

const PRIORIDAD_VARIANT: Record<Prioridad, "danger" | "warning" | "neutral"> = {
  alta: "danger",
  media: "warning",
  baja: "neutral",
};

export interface RecalculationBannerProps {
  cambios: RecalculoCambio[];
  onAcknowledge: () => void;
}

export function RecalculationBanner({ cambios, onAcknowledge }: RecalculationBannerProps) {
  if (cambios.length === 0) return null;

  return (
    <Card role="status" className="flex flex-col gap-3 border-warning/50 bg-warning/5">
      <p className="text-body-sm font-semibold text-ink-primary">
        {cambios.length === 1
          ? "Se recalculó 1 prioridad automáticamente"
          : `Se recalcularon ${cambios.length} prioridades automáticamente`}
      </p>

      <ul className="flex flex-col gap-2">
        {cambios.map((cambio) => (
          <li key={cambio.requisitoId} className="text-body-sm text-ink-secondary">
            <span className="font-medium text-ink-primary">{cambio.descripcion}</span>
            {": "}
            <Badge variant={PRIORIDAD_VARIANT[cambio.anterior]}>{cambio.anterior}</Badge>
            {" → "}
            <Badge variant={PRIORIDAD_VARIANT[cambio.actual]}>{cambio.actual}</Badge>
            {" — porque "}
            {cambio.detalle}
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <Button variant="secondary" className="w-auto" onClick={onAcknowledge}>
          Entendido
        </Button>
      </div>
    </Card>
  );
}
