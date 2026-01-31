import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { PetsFacade } from "../../facades/pets.facade";
import { filter, Observable, take } from "rxjs";
import { TutoresFacade } from "../../../tutores/facades/tutores.facade";
import { Tutor } from "../../../../core/models/tutor.model";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './pet-form.page.html',
})
export class PetFormPage implements OnInit {

  form!: FormGroup;
  edit = false;
  petId?: number;

  fotoDeletedId?: number;
  selectedFile?: File | null;
  fotoPreviewUrl?: string | null;
  tutoresList: Tutor[] = [];

  constructor(
    private fb: FormBuilder,
    private facade: PetsFacade,
    private router: Router,
    private route: ActivatedRoute,
    private tutoresFacade: TutoresFacade,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }



  initForm() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      raca: [''],
      idade: [''],
      foto: [''],
      tutores: [[]],
    });

  this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.edit = false;
      this.petId = undefined;
      this.form.reset();

      if (id) {
        this.edit = true;
        this.petId = +id;

        this.facade.loadPetById(this.petId);

        this.facade.selectedPet$
          .pipe(filter(Boolean), take(1))
          .subscribe(pet => this.form.patchValue(pet));
      }
    });

    if(this.edit){
      this.facade.selectedPet$.pipe(filter(Boolean), take(1)).subscribe(pet => {
        if (pet && pet.foto) {
          this.fotoPreviewUrl = pet.foto.url;
          this.tutoresList = pet.tutores || [];

        }
      });
    }
  }

  submit() {
    if (this.form?.invalid) return;

    if (this.edit) {
      this.facade.editPet(this.petId!, this.form?.value);
      if(this.selectedFile || this.fotoDeletedId){
        this.uploadFoto(this.petId!);
      }

    } else {
      const fileToUpload = this.selectedFile;
      this.facade.novoPet(this.form?.value, ).subscribe(pet => {
        const newPetId = pet.id;
        if(this.selectedFile || fileToUpload){
          this.selectedFile = fileToUpload
          this.uploadFoto(newPetId);
        }
      });
    }
    this.bakHome();
  }

  bakHome() {
    this.facade.reloadList();
    this.router.navigate(['/pets']);
  }

  removerFoto(id: number){
    this.form.get('foto')?.setValue(null);
    this.fotoDeletedId = id;
    this.fotoPreviewUrl = undefined;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFile = file;

    this.fotoPreviewUrl = URL.createObjectURL(file);

    input.value = '';
  }

  uploadFoto(petId: number) {
    if(this.fotoDeletedId)
    {
      this.facade.deleteFotoPet(petId, this.fotoDeletedId).subscribe(() => {
      console.log('foto Excluida');
    });
    }
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('foto', this.selectedFile);

    this.facade.novaFotoPet(petId, formData).subscribe(() => {
      console.log('foto salva');
    });
  }

  ngOnDestroy(): void {
    this.selectedFile = null;
    this.fotoPreviewUrl = null;
  }

  removerTutor(tutor: Tutor){
    if(this.petId){
      this.tutoresFacade.deleteTutorPet(tutor.id, this.petId).subscribe((res) => {
      })
    }
    this.tutoresList = this.tutoresList.filter((tut) => tut.id != tutor.id)
  }
  deletePet(){
    if(this.petId){
      this.facade.deletePet(this.petId).subscribe(()=>{
        this.bakHome()
      })
    }
  }
}
