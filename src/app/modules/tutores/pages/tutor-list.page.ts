import { Component, OnInit } from "@angular/core";
import { Tutor } from "../../../core/models/tutor.model";
import { Observable } from "rxjs/internal/Observable";
import { Router } from "@angular/router";
import { TutoresFacade } from "../facades/tutores.facade";
import { take } from "rxjs";
import { FormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";

@Component({
  selector: 'app-tutor-list-page',
  templateUrl: './tutor-list.page.html',
  standalone: true,
  imports: [FormsModule, AsyncPipe, PaginatorComponent],

})
export class TutorListPage implements OnInit {

  tutores$!: Observable<Tutor[]>;

  nomeSearch: string = '';
  sizeSearch: number = 10;
  page$!: Observable<number>;
  pageCount$!: Observable<number>;
  total$!: Observable<number>;

  constructor(
    private facade: TutoresFacade,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tutores$ = this.facade.tutores$;
    this.page$ = this.facade.page$;
    this.pageCount$ = this.facade.pageCount$;
    this.total$ = this.facade.total$;
    this.facade.loadTutores();
  }

  search() {
    console.log(this.nomeSearch);
    this.facade.loadTutores(0, this.sizeSearch, this.nomeSearch);
  }

  onPageChange(page: number) {
    this.facade.loadTutores(
        page - 1,
        this.sizeSearch,
        this.nomeSearch
      );
  }

  viewDetail(id: number) {
    this.router.navigate(['/tutores', id]);
  }

  novoTutor() {
    this.router.navigate(['/new', 'tutores']);
  }

  goHome(){
    this.router.navigate(['/pets']);
  }
}
