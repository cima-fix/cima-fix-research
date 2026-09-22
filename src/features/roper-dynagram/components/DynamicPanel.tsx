// features/roper-dynagram/components/DynamicPanel.tsx
// Panel dinámico de salida: al seleccionar un segmento (en la rueda o en
// la lista accesible), muestra su requisito UX derivado, funcionalidad
// clave y tono del sistema — investigacion_de_usuarios.md §5.

import { Card } from "../../../components/ui/Card";
import type { Segmento } from "../../../types/common";

export interface DynamicPanelProps {
  segmento: Segmento | null;
}

export function DynamicPanel({ segmento }: DynamicPanelProps) {
  if (!segmento) {
    return (
      <Card className="text-body-sm text-ink-secondary">
        Selecciona un segmento en la rueda para ver su requisito UX,
        funcionalidad clave y tono del sistema derivados.
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="text-heading-6 font-semibold text-ink-primary">
          {segmento.nombre}
        </h3>
        <p className="text-body-sm text-ink-secondary">{segmento.criterio}</p>
      </div>

      <dl className="flex flex-col gap-2">
        <div>
          <dt className="text-body-xs font-medium text-ink-secondary">
            Requisito UX derivado
          </dt>
          <dd className="text-body-sm text-ink-primary">{segmento.requisitoUX}</dd>
        </div>
        <div>
          <dt className="text-body-xs font-medium text-ink-secondary">
            Funcionalidad clave
          </dt>
          <dd className="text-body-sm text-ink-primary">
            {segmento.funcionalidadClave}
          </dd>
        </div>
        <div>
          <dt className="text-body-xs font-medium text-ink-secondary">
            Tono del sistema
          </dt>
          <dd className="text-body-sm text-ink-primary">{segmento.tonoSistema}</dd>
        </div>
      </dl>
    </Card>
  );
}
