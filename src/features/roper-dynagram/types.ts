// features/roper-dynagram/types.ts
// Local data model for the "Roper Dynagram" interface.
// Segmento and AsignacionSegmento live in types/common.ts (contract
// from blueprint.md §4.1, interface 5); this file only adds what is
// exclusive to this interface: the interviewed subject that gets
// assigned to one or more segments.

import type { Identifiable } from "../../lib/list";

export interface Sujeto extends Identifiable {
  nombre: string;
}
