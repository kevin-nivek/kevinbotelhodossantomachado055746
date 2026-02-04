import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { TutorFormPage } from './tutor-form.page';
import { Tutor } from '../../../../core/models/tutor.model';
import { TutoresFacade } from '../../facades/tutores.facade';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';


describe('TutorFormPage', () => {
  let component: TutorFormPage;
  let fixture: ComponentFixture<TutorFormPage>;

  let tutoresFacade: any;
  let petsFacade: any;

  const tutorMock: Tutor = {
    id: 1,
    nome: 'Odisseu',
    cpf: '123123123',
    telefone: '66999999',
    endereco: 'Rua sim',
    foto: null,
    pets: [],
    email: 'odisseu@email.com'
  };

  function createComponent(routeId?: string) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        paramMap: of(convertToParamMap(routeId ? { id: routeId } : {}))
      }
    });

    fixture = TestBed.createComponent(TutorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    tutoresFacade = {
      novoTutor: vi.fn(() => of(tutorMock)),
      editTutor: vi.fn(() => of(tutorMock)),
      loadTutorById: vi.fn(),
      loadTutores: vi.fn(),
      reloadList: vi.fn(),
      selectedTutor$: of(tutorMock)

    };

    petsFacade = {
      loadPets: vi.fn(),
      tutores$: of([]),
      clearPets: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TutorFormPage, ReactiveFormsModule],
      providers: [
        provideNgxMask(),
        { provide: TutoresFacade, useValue: tutoresFacade },
        { provide: PetsFacade, useValue: petsFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();
  });

  it('Cria pagina TutorForm', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('Formulario invalido', () => {
    createComponent();
    expect(component.form.invalid).toBe(true);
  });

  it('Nao aceta formulario invalido', () => {
    createComponent();
    component.submit();
    expect(tutoresFacade.novoTutor).not.toHaveBeenCalled();
  });

  it('Cria Tutor formulario valido', () => {
    createComponent();
    component.edit = false;
    component.tutorId = undefined;
    component.form.patchValue({
      nome: 'Aquiles',
      email: 'aquiles@email.com',
      telefone: '65999999212',
      endereco: 'Avenida troia'
    });

    component.submit();

    expect(tutoresFacade.novoTutor).toHaveBeenCalled();
  });

  it('Busca Tutor com id na rota', () => {
    createComponent('1');

    expect(tutoresFacade.loadTutorById).toHaveBeenCalledWith(1);
    expect(component.edit).toBe(true);
  });

  it('Teste de edicao', () => {
    createComponent('1');
    component.edit = true;
    component.tutorId = 1;
    component.form.patchValue({
      nome: 'Aquiles',
      email: 'aquiles@email.com',
      telefone: '65991111112',
      endereco: 'Avenida troia',
      cpf: '12345678901',
      foto: null,
      pets: [],
      nomePetSearch: ''
    });
    expect(component.form.valid).toBe(true);
    component.submit();

    expect(tutoresFacade.editTutor).toHaveBeenCalledWith(1, component.form.value);
  });
});
