import { Component, OnInit } from "@angular/core";
import { PetsFacade } from "../../facades/pets.facade";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { Pet } from "../../../../core/models/pet.model";
import { AsyncPipe } from "@angular/common";
import { TelefonePipe } from "../../../../shared/pipes/telefone-pipe";


@Component({
  standalone: true,
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  imports: [ AsyncPipe, TelefonePipe],
})

export class PetDetailPage implements OnInit{

  pet$!: Observable<Pet | null>;

  constructor(
    private facade: PetsFacade,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.pet$ = this.facade.selectedPet$;
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.facade.loadPetById(+petId);
    }
  }

  goToEdit(){
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/pets', id, 'edit']);
  }

  backToList() {
    this.router.navigate(['/pets']);
  }
}
