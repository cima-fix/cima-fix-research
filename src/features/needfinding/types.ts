// features/needfinding/types.ts
//
// Data model specific to this interface (see blueprint.md §4).
// Fields defined in investigacion_de_usuarios.md §3 ("The Iceberg"):
// observation context, two layers of the iceberg (obvious/hidden), explicit
// separation of raw data vs. interpretation, and innovation potential.

export type InnovationPotential = "alto" | "bajo";

export interface NeedfindingObservation {
  id: string;

  // Observation context
  location: string;
  date: string; // yyyy-mm-dd, native value of <input type="date">
  duration: string;
  activity: string;

  // Surface layer: obvious needs (what the user says / feature requests)
  obviousNeeds: string;

  // Depth layer: hidden needs (silenced frustrations, emotions)
  hiddenNeeds: string;

  // Explicit separation between raw data and interpretation (investigacion_de_usuarios.md §3)
  rawData: string;
  interpretation: string;

  // Innovation potential tag
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