import { Injectable } from "@angular/core";
import { Tutor } from "../../../core/models/tutor.model";
import { BehaviorSubject, Observable } from "rxjs";
import { TutoresService } from "../services/tutores.service";

@Injectable({
  providedIn: 'root'
})

export class TutoresFacade {

  private tutoresSubject = new BehaviorSubject<Tutor[]>([]);
  tutores$ = this.tutoresSubject.asObservable();

  private pageSubject = new BehaviorSubject<number>(0);
  page$ = this.pageSubject.asObservable();

  private pageCountSubject = new BehaviorSubject<number>(0);
  pageCount$ = this.pageCountSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();


  private selectedTutorSubject = new BehaviorSubject<Tutor | null>(null);
    selectedTutor$ = this.selectedTutorSubject.asObservable();

  constructor(private service: TutoresService) {}

  loadTutores(page = 0, size = 10, nome = '') {
    this.service.listarTutores(page, size, nome).subscribe(res => {
      this.tutoresSubject.next(res.content);
      this.pageSubject.next(res.page);
      this.pageCountSubject.next(res.pageCount);
      this.totalSubject.next(res.total);
    });
  }

  loadTutorById(id: number) {
    return this.service.getTutorById(id).subscribe(tutor => {
      this.selectedTutorSubject.next(tutor);
    });
  }

  novoTutor(tutorData: any): Observable<Tutor> {
    return this.service.novoTutor(tutorData);
  }

  novaFotoTutor(tutorId: number, fotoData: FormData) {
    return this.service.novaFoto(tutorId, fotoData);
  }

  editTutor(id: number, tutorData: any) {
    this.service.editTutor(id, tutorData).subscribe(() => this.loadTutores());
  }

  deleteFotoTutor(tutorId: number, fotoId: number) {
    return this.service.deleteFoto(tutorId, fotoId);
  }

  novoTutorPet(tutorId: number, petId: number) {
    return this.service.novoTutorPet(tutorId, petId);
  }

  deleteTutorPet(tutorId: number, fotoId: number) {
    return this.service.deleteFoto(tutorId, fotoId);
  }

}
