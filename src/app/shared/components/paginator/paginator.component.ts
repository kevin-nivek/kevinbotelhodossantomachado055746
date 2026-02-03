import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
  imports: [CommonModule],

})
export class PaginatorComponent {

  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;


  @Output() pageChange = new EventEmitter<number>();

  goTo(page: number){
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

}
