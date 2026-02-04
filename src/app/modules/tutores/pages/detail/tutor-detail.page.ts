import { AsyncPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Tutor } from "../../../../core/models/tutor.model";
import { filter, Observable, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { TutoresFacade } from "../../facades/tutores.facade";
import { Pet } from "../../../../core/models/pet.model";

@Component({
  selector: 'app-tutor-detail-page',
  templateUrl: './tutor-detail.page.html',
  standalone: true,
  imports: [  AsyncPipe]
})
export class TutorDetailPage implements OnInit {
  tutor$!: Observable<Tutor | null>

  listPets: Pet[] = [];

  constructor(private facade: TutoresFacade,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.tutor$ = this.facade.selectedTutor$;
    this.tutor$
        .pipe(filter((tutor): tutor is Tutor => !!tutor))
        .subscribe(tutor => {
          this.listPets = tutor.pets ?? [];
    });
    const tutorId = this.route.snapshot.paramMap.get('id');
    if(tutorId){
      this.facade.loadTutorById(+tutorId);
    }
  }

  goToEdit(){
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/tutores', id, 'edit']);
  }

  backToList() {
    this.router.navigate(['/tutores']);
  }

}
