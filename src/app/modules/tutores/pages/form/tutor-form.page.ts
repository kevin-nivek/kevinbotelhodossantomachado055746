import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TutoresFacade } from "../../facades/tutores.facade";
import { filter, Observable, take } from "rxjs";
import { Router } from "@angular/router";
import { Pet } from "../../../../core/models/pet.model";
import { PetsFacade } from "../../../pets/facades/pets.facade";

@Component({
  selector: 'app-tutor-form-page',
  templateUrl: './tutor-form.page.html',
  imports: [CommonModule, ReactiveFormsModule]
})

export class TutorFormPage implements OnInit {

  form!: FormGroup;
  edit = false;
  tutorId?: number;

  fotoDeletedId?: number;
  selectedFile?: File | null;
  fotoPreviewUrl?: string | null;

  listPets: Pet[] = [];

  petsOptions: Pet[] =[]
  newPetsIds: number[] = [];
  deletedPetsIds: number[] = [];
  nomePetSearch: string = '';
  pets$: Observable<Pet[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private facade: TutoresFacade,
    private router: Router,
    private route: ActivatedRoute,
    private petsFacade: PetsFacade,
  )
  { }

  ngOnInit(): void {
    this.initForm();
    this.petsFacade.clearPets()
    this.pets$ = this.petsFacade.pets$;
  }

  initForm() {
    this.form = this.fb.group({
      nome: [''],
      telefone: [''],
      email: [''],
      endereco: [''],
      cpf: [''],
      foto: [''],
      pets: [[]],
      nomePetSearch: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.edit = false;
      this.tutorId = undefined;
      this.form.reset();

      if (id) {
        this.edit = true;
        this.tutorId = +id;

        this.facade.loadTutorById(this.tutorId);

        this.facade.selectedTutor$
          .pipe(filter(Boolean), take(1))
          .subscribe(tutor => this.form.patchValue(tutor));
      }
    });

    if(this.edit){
      this.facade.selectedTutor$.pipe(filter(Boolean), take(1)).subscribe(tutor => {
        if (tutor && tutor.foto) {
          console.log(tutor);

          this.fotoPreviewUrl = tutor.foto.url;
          this.listPets = tutor.pets || []
        }
      });
    }
  }

  submit() {
    if (this.edit && this.tutorId) {
      this.facade.editTutor(this.tutorId, this.form.value);
      if(this.selectedFile){
        this.uploadFoto(this.tutorId!);
      }
    } else {
      const fileToUpload = this.selectedFile;
      const idsPetsList = this.newPetsIds
      this.facade.novoTutor(this.form.value).subscribe( tutor => {
        const newTutorId = tutor.id;
        this.selectedFile = fileToUpload
        if(this.selectedFile){
          this.uploadFoto(newTutorId);
        }

        for (const petId of idsPetsList) {
          this.facade.novoTutorPet(newTutorId, petId).subscribe((res)=>{
            console.log(res);

          })

        }

      })
    }

    this.backtutores()
  }

  backtutores() {
    this.facade.reloadList()
    this.router.navigate(['/tutores']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFile = file;

    this.fotoPreviewUrl = URL.createObjectURL(file);

    input.value = '';
  }


  removerFoto(id: number){
    this.form.get('foto')?.setValue(null);
    this.fotoDeletedId = id;
    this.fotoPreviewUrl = undefined;
  }

  uploadFoto(tutorId: number) {
    if(this.fotoDeletedId)
    {
      this.facade.deleteFotoTutor(tutorId, this.fotoDeletedId).subscribe(() => {
      console.log('foto Excluida');
    });
    }
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('foto', this.selectedFile);

    this.facade.novaFotoTutor(tutorId, formData).subscribe(() => {
      console.log('foto salva');
    });
  }

  ngOnDestroy(): void {
    this.selectedFile = null;
    this.fotoPreviewUrl = null;
  }

  searchPet(){
    const nomeBusca =  this.form.get('nomePetSearch')?.value
    this.petsFacade.loadPets(0, 1000000, nomeBusca);
    this.petsFacade.pets$
    .pipe(take(1))
    .subscribe(tutores => {
      this.petsOptions = tutores;
    });
  }

  addNewPet(pet: Pet){
    if(this.tutorId){
      this.facade.novoTutorPet(this.tutorId, pet.id).subscribe((res) => {
        console.log('Pet adicionado com sucesso');
      })
    }
    else{
      this.newPetsIds.push(pet.id)
    }
    this.listPets.push(pet);
  }

  removerPet(pet: Pet){
    if(this.tutorId){
      this.facade.deleteTutorPet(this.tutorId, pet.id).subscribe((res) => {
        console.log('Tutor removido')
      })
    }
    this.listPets = this.listPets.filter((p) => p.id != pet.id)
  }

  deleteTutor(){
    if(this.tutorId){
      this.facade.deleteTutor(this.tutorId).subscribe(()=> {
        this.backtutores()
      })
    }
  }

}
