import { Foto } from "./foto.model";
import { Pet } from "./pet.model";

export interface Tutor{
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
  foto: Foto | null;
  pets: Pet[]
}
