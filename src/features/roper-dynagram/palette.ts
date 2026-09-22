// features/roper-dynagram/palette.ts
// Categorical palette for the segment wheel.
//
// PENDING (blueprint.md §7): a new color must be defined in Figma
// first and then reflected in @theme (src/index.css) — but the number
// of segments here is dynamic (depends on the real data loaded), so
// this point is still to be resolved with Mike before the final
// delivery. In the meantime, this local palette reuses the tones that
// already exist in @theme as a functional placeholder, so as not to
// block development (blueprint.md §9).
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
