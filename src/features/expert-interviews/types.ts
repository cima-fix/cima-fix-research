// features/expert-interviews/types.ts
// Modelo de datos de la interfaz "Entrevista a Expertos".
// Fields based on `investigacion_de_usuarios.md` §1 — do not add fields not requested in that document.

import type { Identifiable } from "../../lib/list";

export type MedioEntrevista = "presencial" | "remoto";

export interface PerfilExperto {
  alias: string;
  rol: string;
  dominio: string;
  aniosExperiencia: number;
  organizacion: string;
  fecha: string; // ISO date string
  medio: MedioEntrevista;
}

export interface PreguntaRespuesta extends Identifiable {
  pregunta: string;
  respuesta: string;
  esCitaTextualClave: boolean;
}

export interface ComplejidadTecnica {
  conceptosClave: string[];
  jergaDelDominio: string[];
  dependenciasEntreComponentes: string[];
  actoresDelEcosistema: string[];
}

export interface Referencia extends Identifiable {
  descripcion: string;
  url?: string;
}

export interface ExpertInterview extends Identifiable {
  perfil: PerfilExperto;
  guion: PreguntaRespuesta[];
  complejidadTecnica: ComplejidadTecnica;
  restriccionesYRiesgos: string[];
  referencias: Referencia[];
  notas: string;
  siguientesPasos: string;
}