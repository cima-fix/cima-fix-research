// features/roper-dynagram/palette.ts
// Paleta categórica para la rueda de segmentos.
//
// PENDIENTE (blueprint.md §7): un color nuevo debe definirse primero en
// Figma y reflejarse después en @theme (src/index.css) — pero el número
// de segmentos aquí es dinámico (depende de los datos reales cargados),
// así que este punto queda por resolver con Mike antes de la entrega
// final. Mientras tanto, esta paleta local reutiliza los tonos que ya
// existen en @theme como placeholder funcional, para no bloquear el
// desarrollo (blueprint.md §9).
export const SEGMENT_PALETTE = [
  "#002e6b", // --color-primary
  "#1a7a53", // --color-success
  "#976621", // --color-warning
  "#942525", // --color-danger
  "#4b4b4b", // --color-grey-700
  "#757575", // --color-grey-500
] as const;

export function colorForIndex(index: number): string {
  return SEGMENT_PALETTE[index % SEGMENT_PALETTE.length];
}
