import { Component, OnInit } from "@angular/core";
import { Pet } from "../../../core/models/pet.model";
import { PetsFacade } from "../pets.facade";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { AsyncPipe } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-pet-list',
  templateUrl: './pet-list.page.html',
  imports: [FormsModule, AsyncPipe],
})
export class PetListPage implements OnInit {

  pets$!: Observable<Pet[]>;
  page: number = 0;
  nomeSerach: string = '';
  racaSearch: string = '';
  sizeSearch: number = 10;

  constructor(private facade: PetsFacade) {}

  ngOnInit(): void {
    this.pets$ = this.facade.pets$;
    this.facade.loadPets();
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
