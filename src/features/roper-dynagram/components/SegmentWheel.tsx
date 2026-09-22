// features/roper-dynagram/components/SegmentWheel.tsx
// Rueda de segmentos (gráfico polar) — investigacion_de_usuarios.md §5.
// El tamaño de cada gajo viene de SegmentStat.porcentaje (../stats.ts),
// derivado en runtime a partir de las asignaciones reales: se recalcula
// solo cuando cambian los datos, nunca es un valor fijo.
//
// La lista de botones debajo del gráfico es la vía accesible: el
// gráfico de Recharts se marca aria-hidden porque no es operable por
// teclado, pero cada segmento sigue siendo seleccionable sin mouse.

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../../../lib/cn";
import { colorForIndex } from "../palette";
import type { SegmentStat } from "../stats";

export interface SegmentWheelProps {
  stats: SegmentStat[];
  selectedSegmentoId: string | null;
  onSelect: (segmentoId: string) => void;
  className?: string;
}

export function SegmentWheel({
  stats,
  selectedSegmentoId,
  onSelect,
  className,
}: SegmentWheelProps) {
  const data = stats.map((stat) => ({
    id: stat.segmento.id,
    name: stat.segmento.nombre,
    value: stat.conteo,
  }));

  const hasData = data.some((entry) => entry.value > 0);

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      {/*
        [&_*]:outline-none: Recharts marca sus sectores como enfocables
        (tabIndex) por accesibilidad interna, pero aquí ya son
        aria-hidden y la alternativa accesible real es la lista de
        botones de abajo — sin esto, un clic con mouse deja el foco del
        navegador (y su contorno) sobre el SVG, que se ve como si todo
        el recuadro quedara "seleccionado".
      */}
      <div className="h-64 w-full [&_*]:outline-none" aria-hidden="true">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={2}
                onClick={(_, index) => onSelect(data[index].id)}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={colorForIndex(index)}
                    stroke={entry.id === selectedSegmentoId ? "#002e6b" : "none"}
                    strokeWidth={entry.id === selectedSegmentoId ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} asignación(es)`, "Conteo"]} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center justify-center text-center text-body-sm text-ink-secondary">
            Agrega segmentos y asignaciones para ver la rueda.
          </p>
        )}
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Segmentos y su proporción observada">
        {stats.map((stat, index) => (
          <li key={stat.segmento.id}>
            <button
              type="button"
              onClick={() => onSelect(stat.segmento.id)}
              aria-pressed={stat.segmento.id === selectedSegmentoId}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-1.5 text-body-sm transition-colors",
                stat.segmento.id === selectedSegmentoId
                  ? "border-primary bg-secondary text-ink-primary"
                  : "border-border text-ink-secondary hover:bg-secondary",
              )}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colorForIndex(index) }}
              />
              {stat.segmento.nombre}
              <span className="text-body-xs text-ink-secondary">
                {Math.round(stat.porcentaje * 100)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
