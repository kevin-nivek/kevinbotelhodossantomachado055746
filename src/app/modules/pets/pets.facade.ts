import { Injectable } from "@angular/core";
import { PetsService } from "./pets.service";
import { Observable } from "rxjs/internal/Observable";
import { Pet } from "../../core/models/pet.model";

@Injectable({
  providedIn: 'root'
})
export class PetsFacade  {
pets$!: Observable<Pet[]>;

  constructor(private service: PetsService) {
    this.pets$ = this.service.pets$;
  }


  // constructor(private service: PetsService) {}

  // get pets$() {
  //   return this.service.pets$;
  // }

  loadPets(page: number = 0, size: number = 10, nome: string = '', raca: string = '') {
    this.service.listar(page, size, nome, raca).subscribe(res => {
      console.log(res);

        this.service.setPets(res);
    })
  }

}
