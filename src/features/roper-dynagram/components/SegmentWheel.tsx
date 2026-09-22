// features/roper-dynagram/components/SegmentWheel.tsx
// Segment wheel (polar chart) — investigacion_de_usuarios.md §5.
// Each slice's size comes from SegmentStat.porcentaje (../stats.ts),
// derived at runtime from the real assignments: it's recalculated
// only when the data changes, it's never a fixed value.
//
// The button list below the chart is the accessible path: the
// Recharts chart is marked aria-hidden because it isn't keyboard
// operable, but every segment is still selectable without a mouse.

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
        [&_*]:outline-none: Recharts marks its sectors as focusable
        (tabIndex) for internal accessibility, but here they're already
        aria-hidden and the real accessible alternative is the button
        list below — without this, a mouse click leaves the browser's
        focus (and its outline) on the SVG, which looks like the whole
        box got "selected".
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
              <Tooltip
                formatter={(value) => [`${value ?? 0} asignación(es)`, "Conteo"]}
              />
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
