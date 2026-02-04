import { Injectable } from "@angular/core";
import { PetsService } from "../services/pets.service";
import { Observable } from "rxjs/internal/Observable";
import { Pet } from "../../../core/models/pet.model";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class PetsFacade  {
  private petsSubject = new BehaviorSubject<Pet[]>([]);
  pets$ = this.petsSubject.asObservable();


  private pageSubject = new BehaviorSubject<number>(0);
  page$ = this.pageSubject.asObservable();

  private pageCountSubject = new BehaviorSubject<number>(0);
  pageCount$ = this.pageCountSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  private selectedPetSubject = new BehaviorSubject<Pet | null>(null);
  selectedPet$ = this.selectedPetSubject.asObservable();
  constructor(private service: PetsService) {}


  loadPets(page = 0, size = 10, nome = '', raca = '') {
    this.service.listar(page, size, nome, raca)
      .subscribe(res => {
        this.petsSubject.next(res.content);
        this.pageSubject.next(res.page);
        this.pageCountSubject.next(res.pageCount);
        this.totalSubject.next(res.total);
      });
  }

  loadPetById(id: number) {
    this.service.getById(id).subscribe(pet => {
      console.log(pet);
      this.selectedPetSubject.next(pet);
    });
  }

  novoPet(petData: any): Observable<Pet> {
    return this.service.novoPet(petData);
  }

  novaFotoPet(petId: number, fotoData: FormData) {
    return this.service.novaFoto(petId, fotoData);
  }

  editPet(id: number, petData: any) {
    return this.service.editPet(id, petData);
  }

  deleteFotoPet(petId: number, fotoId: number) {
    return this.service.deleteFoto(petId, fotoId);
  }

  reloadList() {
    this.loadPets(
      0,
      10
    );
  }

  deletePet(petId: number){
    return this.service.deletePet(petId);
  }

  clearPets() {
    this.petsSubject.next([]);
  }
}
