import { Foto } from "./foto.model";
import { Tutor } from "./tutor.model";

export interface Pet{
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto: Foto | null;
  tutores: Tutor[];
}
