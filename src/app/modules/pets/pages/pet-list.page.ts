import { Component, OnInit } from "@angular/core";
import { Pet } from "../../../core/models/pet.model";
import { PetsFacade } from "../pets.facade";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { AsyncPipe } from "@angular/common";
import { take } from "rxjs";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-pet-list',
  templateUrl: './pet-list.page.html',
  imports: [FormsModule, AsyncPipe],
})
export class PetListPage implements OnInit {

  pets$!: Observable<Pet[]>;

  nomeSerach: string = '';
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
    this.facade.loadPets(0, this.sizeSearch, this.nomeSerach, this.racaSearch);
  }

  nextPage(page: number) {
    this.pageCount$.pipe(take(1)).subscribe(pageCount => {
      if (page + 1 < pageCount) {
        this.facade.loadPets(
          page + 1,
          this.sizeSearch,
          this.nomeSerach,
          this.racaSearch
        );
      }
    });
  }
  previousPage(page: number) {
    if (page - 1 >= 0) {
        this.facade.loadPets(
          page - 1,
          this.sizeSearch,
          this.nomeSerach,
          this.racaSearch
        );
      }
  }

  viewDetail(id: number) {
    this.router.navigate(['/pets', id]);
  }
}
