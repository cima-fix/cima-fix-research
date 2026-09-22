export type Quadrant = "dice" | "hace" | "piensa" | "siente";

export interface Subject {
  id: string;
  nombre: string;
}

export interface Fragment {
  id: string;
  texto: string;
  estado: "sin-clasificar" | "clasificado";
  cuadrante?: Quadrant;
}