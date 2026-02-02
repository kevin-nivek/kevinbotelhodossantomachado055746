import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { TutorListPage } from './tutor-list.page';
import { TutoresFacade } from '../facades/tutores.facade';



describe('TutorListPage', () => {
  let component: TutorListPage;
  let fixture: ComponentFixture<TutorListPage>;
  let facade: any;

  beforeEach(async () => {
    facade = {
      loadTutores: vi.fn(),
      tutores$: of([])
    };

    await TestBed.configureTestingModule({
      imports: [TutorListPage], // standalone
      providers: [
        { provide: TutoresFacade, useValue: facade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('Teste de criação de pagina TutorListPage', () => {
  expect(component).toBeTruthy();
});

  it('Carrega Tutores ', () => {
    expect(facade.loadTutores).toHaveBeenCalled();
  });
});
