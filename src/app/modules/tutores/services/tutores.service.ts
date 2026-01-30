import { Injectable } from "@angular/core";
import { Tutor } from "../../../core/models/tutor.model";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { enviroment } from "../../../../enviroment/enviroment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PetsPage } from "../../../core/models/pets-page-model";

@Injectable({
  providedIn: 'root'
})
export class TutoresService {

  private tutoresSubject = new BehaviorSubject<Tutor[]>([])
  tutores$ = this.tutoresSubject.asObservable();

  private readonly apiUrl = `${enviroment.apiUrl}/v1/tutores`

  constructor(private http: HttpClient) {}

  listarTutores(page: number = 0, size: number = 10, nome: string = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<PetsPage<Tutor>>(this.apiUrl, { params });
  }

  getTutorById(id: number) {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`);
  }

  novoTutor(tutorData: any): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl, tutorData);
  }

  editTutor(id: number, tutorData: Partial<Tutor>) {
    return this.http.put<Tutor>(`${this.apiUrl}/${id}`, tutorData);
  }

  novaFoto(tutorId: number, fotoData: FormData) {
    return this.http.post<Tutor>(`${this.apiUrl}/${tutorId}/fotos`, fotoData);
  }
  deleteFoto(tutorId: number, fotoId: number) {
    return this.http.delete(`${this.apiUrl}/${tutorId}/fotos/${fotoId}`);
  }

  novoTutorPet(tutorId: number, petId: number) {
    return this.http.post(`${this.apiUrl}/${tutorId}/pets/${petId}`, {});
  }

  removerTutorPet(tutorId: number, petId: number) {
    return this.http.delete(`${this.apiUrl}/${tutorId}/pets/${petId}`);
  }

}
