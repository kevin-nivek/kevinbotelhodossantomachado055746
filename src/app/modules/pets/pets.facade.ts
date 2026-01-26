import { Injectable } from "@angular/core";
import { PetsService } from "./pets.service";
import { Observable } from "rxjs/internal/Observable";
import { Pet } from "../../core/models/pet.model";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class PetsFacade  {
  private petsSubject = new BehaviorSubject<Pet[]>([]);
  pets$ = this.petsSubject.asObservable();

  constructor(private service: PetsService) {}


  loadPets(page = 0, size = 10, nome = '', raca = '') {
    this.service.listar(page, size, nome, raca)
      .subscribe(res => {
        this.petsSubject.next(res.content ?? []);
      });
  }

}
