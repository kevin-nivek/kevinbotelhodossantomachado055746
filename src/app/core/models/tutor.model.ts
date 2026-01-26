import { Foto } from "./foto.model";

export interface Tutor{
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string;
  foto: Foto | null;
}
