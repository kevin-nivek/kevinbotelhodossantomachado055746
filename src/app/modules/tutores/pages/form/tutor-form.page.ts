import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TutoresFacade } from "../../facades/tutores.facade";
import { filter, Observable, take } from "rxjs";
import { Router } from "@angular/router";
import { Pet } from "../../../../core/models/pet.model";
import { PetsFacade } from "../../../pets/facades/pets.facade";
import { NgxMaskDirective } from "ngx-mask";
import { AlertComponent } from "../../../../shared/components/alert/alert.component";
import { AlertService } from "../../../../shared/components/alert/alert.service";
import { Tutor } from "../../../../core/models/tutor.model";

@Component({
  selector: 'app-tutor-form-page',
  templateUrl: './tutor-form.page.html',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, AsyncPipe]
})

export class TutorFormPage implements OnInit {

  form!: FormGroup;
  edit = false;
  tutorId?: number;

  fotoDeletedId?: number;
  selectedFile?: File | null;
  fotoPreviewUrl?: string | null;

  listPets: Pet[] = [];
  listPetsId: number[]= [];
  petsOptions: Pet[] =[]
  newPetsIds: number[] = [];
  deletedPetsIds: number[] = [];
  nomePetSearch: string = '';
  pets$: Observable<Pet[]> | undefined;

  pagePet$:Observable<number> | undefined;
  contPagePet$: Observable<number> |undefined;


  constructor(
    private fb: FormBuilder,
    private facade: TutoresFacade,
    private router: Router,
    private route: ActivatedRoute,
    private petsFacade: PetsFacade,
    private alert: AlertService
  )
  { }

  ngOnInit(): void {
    this.initForm();
    this.loadEVerificaEdicao();

    this.petsFacade.clearPets()
    this.pets$ = this.petsFacade.pets$;
    this.pagePet$ = this.petsFacade.page$;
    this.contPagePet$ = this.petsFacade.pageCount$;
  }

  initForm() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['',Validators.required],
      email: [''],
      endereco: [''],
      cpf: [''],
      foto: [''],
      pets: [[]],
      nomePetSearch: ['']
    });
  }
  loadEVerificaEdicao(){
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
        .subscribe(tutor => {
          this.form.patchValue(tutor);
          this.loadFotoList(tutor);
        });
      }
    });
  }

  loadFotoList(tutor: Tutor){
    if (tutor.foto) {
      this.fotoPreviewUrl = tutor.foto.url;
    }

    this.listPets = tutor.pets || [];
    this.listPetsId = this.listPets.map(p => p.id);
  }

  submit() {
    if (this.form.invalid) {
      this.alert.error('Formulario Inválido')
      this.form.markAllAsTouched();
      return;
    }
    const fileToUpload = this.selectedFile;
    if (this.edit && this.tutorId) {
      this.facade.editTutor(this.tutorId, this.form.value).subscribe({
        next: ()=>{
          this.alert.success('Tutor atualizado com sucesso')
          this.selectedFile = fileToUpload
          if(this.selectedFile ||  this.fotoDeletedId){
            const deletedFotos = this.fotoDeletedId!
            this.uploadFoto(this.tutorId!, deletedFotos);
          }
        },
        error: () => {
          this.alert.error('Erro ao vincular pet');
        }

      })

    } else {

      const idsPetsList = this.newPetsIds
      this.facade.novoTutor(this.form.value).subscribe( tutor => {
        const newTutorId = tutor.id;
        this.selectedFile = fileToUpload
        if(this.selectedFile){
          this.uploadFoto(newTutorId, null);
        }
        for (const petId of idsPetsList) {
          this.facade.novoTutorPet(newTutorId, petId).subscribe((res)=>{
          })

        }
        this.alert.success('Tutor criado com sucesso')
      })
    }

    this.backTutores()
  }

  backTutores() {
      this.facade.loadTutores(0,10,'')
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

  uploadFoto(tutorId: number, fotoDeleted: number | null) {
    if(fotoDeleted)
    {
      this.facade.deleteFotoTutor(tutorId, fotoDeleted).subscribe(() => {
      this.alert.info('foto Excluida');
    });
    }
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('foto', this.selectedFile);

    this.facade.novaFotoTutor(tutorId, formData).subscribe(() => {
      this.alert.success('foto salva');
    });
  }

  ngOnDestroy(): void {
    this.selectedFile = null;
    this.fotoPreviewUrl = null;
  }

  searchPet(pageP: number = 0){
    const nomeBusca =  this.form.get('nomePetSearch')?.value
    this.listPetsId = this.listPets.map(pet => pet.id)
    console.log(nomeBusca);

    if(nomeBusca?.length < 1 || !nomeBusca) return
    this.petsFacade.loadPets(pageP, 10, nomeBusca)
    this.petsFacade.pets$
    .pipe(take(1))
    .subscribe(pets => {

      this.petsOptions = pets;
    });
  }

  addNewPet(pet: Pet) {

    if (this.listPetsId.includes(pet.id)) {
      this.alert.warning('Pet já adicionado ao tutor');
      return;
    }

    if (this.tutorId) {
      this.facade.novoTutorPet(this.tutorId, pet.id)
        .subscribe({
          next: () => {
            this.listPets.push(pet);
            this.listPetsId.push(pet.id);

            this.alert.success('Pet adicionado com sucesso');
          },
          error: () => {
            this.alert.error('Erro ao adicionar pet');
          }
        });

      return;
    }

    this.newPetsIds.push(pet.id);
    this.listPets.push(pet);
    this.listPetsId.push(pet.id);
  }

  removerPet(pet: Pet){
    if(this.tutorId){
      this.facade.deleteTutorPet(this.tutorId, pet.id).subscribe({
        next: () => {
          this.alert.info('Pet removido')
        },
        error: () => {
          this.alert.error('Erro ao adicionar pet');
        }
      })
    }
    this.listPets = this.listPets.filter((p) => p.id != pet.id)
    this.listPetsId = this.listPetsId.filter((pId) => pId != pet.id)
  }

  deleteTutor(){
    if(this.tutorId){
      this.facade.deleteTutor(this.tutorId).subscribe(()=> {
        this.backTutores()
      })
    }
  }

}
