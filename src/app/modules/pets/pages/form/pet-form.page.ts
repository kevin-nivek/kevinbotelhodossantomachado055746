import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { PetsFacade } from "../../pets.facade";
import { filter, take } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-form.page.html',
})
export class PetFormPage implements OnInit {

  form!: FormGroup;
  edit = false;
  petId?: number;

  fotoDeletedId?: number;
  selectedFile?: File;
  fotoPreviewUrl?: string;

  constructor(
    private fb: FormBuilder,
    private facade: PetsFacade,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.facade.selectedPet$.pipe(filter(Boolean), take(1)).subscribe(pet => {
      if (pet && pet.foto) {
        this.fotoPreviewUrl = pet.foto.url;
      }
    });
  }



  initForm() {
    this.form = this.fb.group({
      nome: [''],
      raca: [''],
      idade: [''],
      foto: ['']
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
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.edit = true;
    //   this.petId = +id;

    //   this.facade.loadPetById(this.petId);
    //   this.facade.selectedPet$
    //     .pipe(filter(Boolean), take(1))
    //     .subscribe(pet => this.form.patchValue(pet));
    // }
  }

  submit() {
    if (this.form?.invalid) return;

    if (this.edit) {
      this.facade.editPet(this.petId!, this.form?.value);
      if(this.selectedFile){
        this.uploadFoto(this.petId!);
      }

    } else {
      this.facade.novoPet(this.form?.value).subscribe(pet => {
        const newPetId = pet.id;
        if(this.selectedFile){
          this.uploadFoto(newPetId);
        }

      });
    }




    /**
     * 1 - salva o pet
     * 2 -  salva a foto do pet
     * 3 - salva os tutores do pet
     * 4 - volta para a home
     */

    this.bakHome();
  }

  bakHome() {
    console.log('VOLTANDO HOME');

    this.router.navigate(['/']);
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

    // 🔥 PREVIEW IMEDIATO, SEM BUG
    this.fotoPreviewUrl = URL.createObjectURL(file);

    // limpa input pra permitir selecionar o mesmo arquivo
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
}
