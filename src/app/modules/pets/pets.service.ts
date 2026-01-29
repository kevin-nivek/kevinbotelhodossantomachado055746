import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Pet } from "../../core/models/pet.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { enviroment } from "../../../enviroment/enviroment";
import { PetsPage } from "../../core/models/pets-page-model";

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private petSubjects = new BehaviorSubject<Pet[]>([])
  pets$ = this.petSubjects.asObservable();

  private readonly apiUrl = `${enviroment.apiUrl}/v1/pets`
  constructor(private http: HttpClient) {}

  listar(page: number = 0, size: number = 10, nome: string = '', raca: string = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<PetsPage<Pet>>(this.apiUrl, { params });
  }

  setPets(pets: Pet[]) {
    this.petSubjects.next(pets)
  }

  getById(id: number) {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  novoPet(petData: any): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, petData);
  }

  editPet(id: number, petData: Partial<Pet>) {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, petData);
  }

  novaFoto(petId: number, fotoData: FormData) {
    return this.http.post<Pet>(`${this.apiUrl}/${petId}/fotos`, fotoData);
  }
  deleteFoto(petId: number, fotoId: number) {
    return this.http.delete(`${this.apiUrl}/${petId}/fotos/${fotoId}`);
  }
}
