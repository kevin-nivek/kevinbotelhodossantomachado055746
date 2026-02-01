import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { PetFormPage } from './pet-form.page';
import { Pet } from '../../../../core/models/pet.model';
import { PetsFacade } from '../../facades/pets.facade';
import { TutoresFacade } from '../../../tutores/facades/tutores.facade';


describe('PetFormPage', () => {
  let component: PetFormPage;
  let fixture: ComponentFixture<PetFormPage>;

  let petsFacade: any;
  let tutoresFacade: any;

  const petMock: Pet = {
    id: 1,
    nome: 'Tseu',
    raca: 'Vira-lata',
    idade: 3,
    foto: null,
    tutores: []
  };

  function createComponent(routeId?: string) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        paramMap: of(convertToParamMap(routeId ? { id: routeId } : {}))
      }
    });

    fixture = TestBed.createComponent(PetFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    petsFacade = {
      novoPet: vi.fn(() => of(petMock)),
      editPet: vi.fn(() => of(petMock)),
      loadPetById: vi.fn(),
      reloadList: vi.fn(),
      selectedPet$: of(petMock)
    };

    tutoresFacade = {
      loadTutores: vi.fn(),
      tutores$: of([])
    };

    await TestBed.configureTestingModule({
      imports: [PetFormPage],
      providers: [
        { provide: PetsFacade, useValue: petsFacade },
        { provide: TutoresFacade, useValue: tutoresFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();
  });

  it('Cria pagina PetForm', () => {
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
    expect(petsFacade.novoPet).not.toHaveBeenCalled();
  });

  it('Cria Pet formulario vaido', () => {
    createComponent();

    component.form.patchValue({
      nome: 'Argo',
      raca: 'Vira-lata',
      idade: 3,
      tutorId: 1
    });

    component.submit();

    expect(petsFacade.novoPet).toHaveBeenCalled();
  });

  it('Busca Pet com id na rota', () => {
    createComponent('1');

    expect(petsFacade.loadPetById).toHaveBeenCalledWith(1);
    expect(component.edit).toBe(true);
  });

  it('Teste de edicao', () => {
    createComponent('1');

    component.form.patchValue({
      nome: 'Argos ',
      raca: 'Labrador',
      idade: 4,
      tutorId: 1
    });

    component.submit();

    expect(petsFacade.editPet).toHaveBeenCalledWith(1, component.form.value);
  });
});
