import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PetListPage } from './pet-list.page';
import { PetsFacade } from '../facades/pets.facade';



describe('PetListPage', () => {
  let component: PetListPage;
  let fixture: ComponentFixture<PetListPage>;
  let facade: any;

  beforeEach(async () => {
    facade = {
      loadPets: vi.fn(),
      pets$: of([])
    };

    await TestBed.configureTestingModule({
      imports: [PetListPage], // standalone
      providers: [
        { provide: PetsFacade, useValue: facade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('Teste de criação de pagina PetListPage', () => {
  expect(component).toBeTruthy();
});

  it('Carrega Pets ', () => {
    expect(facade.loadPets).toHaveBeenCalled();
  });
});
