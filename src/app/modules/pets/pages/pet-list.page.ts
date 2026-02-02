import { Component, OnInit } from "@angular/core";
import { Pet } from "../../../core/models/pet.model";
import { PetsFacade } from "../facades/pets.facade";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { AsyncPipe } from "@angular/common";
import { take } from "rxjs";
import { Router } from "@angular/router";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";

@Component({
  standalone: true,
  selector: 'app-pet-list',
  templateUrl: './pet-list.page.html',
  imports: [FormsModule, AsyncPipe, PaginatorComponent],
})
export class PetListPage implements OnInit {

  pets$!: Observable<Pet[]>;

  nomeSearch: string = '';
  racaSearch: string = '';
  sizeSearch: number = 10;
  page$!: Observable<number>;
  pageCount$!: Observable<number>;
  total$!: Observable<number>;

  constructor(private facade: PetsFacade, private router: Router) {}

  ngOnInit(): void {
    this.pets$ = this.facade.pets$;
    this.page$ = this.facade.page$;
    this.pageCount$ = this.facade.pageCount$;
    this.total$ = this.facade.total$;
    this.facade.loadPets();
  }

  search() {
    console.log(this.nomeSearch);

    this.facade.loadPets(0, this.sizeSearch, this.nomeSearch, this.racaSearch);
  }

  onPageChange(page: number) {
    this.facade.loadPets(
        page - 1,
        this.sizeSearch,
        this.nomeSearch,
        this.racaSearch
      );
  }

  viewDetail(id: number) {
    this.router.navigate(['/pets', id]);
  }

  novoPet() {
    this.router.navigate(['/new', 'pets']);
  }

  novoTutor() {
    this.router.navigate(['/new', 'tutores']);
  }
  listTutores() {
    this.router.navigate(['/tutores']);
  }
}
