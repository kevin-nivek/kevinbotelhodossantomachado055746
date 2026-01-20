import { Component, OnInit } from "@angular/core";
import { Pet } from "../../../core/models/pet.model";
import { PetsFacade } from "../pets.facade";

@Component({
  standalone: true,
  selector: 'app-pet-list',
  template: './pet-list.page.html'
})
export class PetListPage implements OnInit {

  pets: Pet[] = [];
  page: number = 0;
  nomeSerach: string = '';
  racaSearch: string = '';
  sizeSearch: number = 10;

  constructor(private facade: PetsFacade) {}

  ngOnInit(): void {
      this.facade.loadPets();
      this.facade.pets$.subscribe(pets => {
        this.pets = pets;
      })
  }

  search() {
    this.page = 0;
    this.facade.loadPets(this.page, this.sizeSearch, this.nomeSerach, this.racaSearch);
  }

  nextPage() {
    this.page++;
    this.facade.loadPets(this.page, this.sizeSearch, this.nomeSerach, this.racaSearch);
  }
}
