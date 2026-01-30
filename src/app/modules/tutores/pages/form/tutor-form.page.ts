import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TutoresFacade } from "../../facades/tutores.facade";
import { filter, take } from "rxjs";
import { Router } from "@angular/router";

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

  constructor(
    private fb: FormBuilder,
    private facade: TutoresFacade,
    private router: Router,
    private route: ActivatedRoute,
  )
  { }

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.form = this.fb.group({
      nome: [''],
      telefone: [''],
      email: [''],
      endereco: [''],
      cpf: [''],
      foto: ['']
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
          this.fotoPreviewUrl = tutor.foto.url;
        }
      });
    }
  }

  submit() {
    if (this.edit && this.tutorId) {
      this.facade.editTutor(this.tutorId, this.form.value);
    } else {
      this.facade.novoTutor(this.form.value).subscribe(() => {
        this.router.navigate(['/tutores']);
      })
    }
  }

  backtutores() {
    this.router.navigate(['/tutores']);
  }

    ngOnDestroy(): void {
    this.selectedFile = null;
    this.fotoPreviewUrl = null;
  }
}
