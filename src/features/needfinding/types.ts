// features/needfinding/types.ts
//
// Modelo de datos específico de esta interfaz (ver blueprint.md §4).
// Campos definidos en investigacion_de_usuarios.md §3 ("El Iceberg"):
// contexto de observación, dos capas del iceberg (obvia/oculta), separación
// explícita dato crudo vs. interpretación, y potencial de innovación.

export type InnovationPotential = "alto" | "bajo";

export interface NeedfindingObservation {
  id: string;

  // Contexto de observación
  location: string;
  date: string; // yyyy-mm-dd, valor nativo de <input type="date">
  duration: string;
  activity: string;

  // Capa superficie: necesidades obvias (lo que el usuario dice / feature requests)
  obviousNeeds: string;

  // Capa profundidad: necesidades ocultas (frustraciones silenciadas, emociones)
  hiddenNeeds: string;

  // Separación explícita entre dato crudo e interpretación (investigacion_de_usuarios.md §3)
  rawData: string;
  interpretation: string;

  // Etiqueta de potencial de innovación
  innovationPotential: InnovationPotential;
}

export type NeedfindingFormValues = Omit<NeedfindingObservation, "id">;

export const EMPTY_NEEDFINDING_FORM: NeedfindingFormValues = {
  location: "",
  date: "",
  duration: "",
  activity: "",
  obviousNeeds: "",
  hiddenNeeds: "",
  rawData: "",
  interpretation: "",
  innovationPotential: "bajo",
};