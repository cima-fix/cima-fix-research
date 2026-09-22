// features/roper-dynagram/types.ts
// Modelo de datos local de la interfaz "Roper Dynagram".
// Segmento y AsignacionSegmento viven en types/common.ts (contrato de
// blueprint.md §4.1, interfaz 5); este archivo solo agrega lo que es
// exclusivo de esta interfaz: el sujeto entrevistado que se asigna a
// uno o más segmentos.

import type { Identifiable } from "../../lib/list";

export interface Sujeto extends Identifiable {
  nombre: string;
}
