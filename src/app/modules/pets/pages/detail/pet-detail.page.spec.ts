import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';

import { PetDetailPage } from './pet-detail.page';
import { PetsFacade } from '../../facades/pets.facade';

describe('PetDetailPage', () => {
  let facade: any;

  beforeEach(async () => {
    facade = {
      loadPetById: vi.fn(),
      selectedPet$: of({ id: 1, nome: 'Bolota' })
    };

    await TestBed.configureTestingModule({
      imports: [PetDetailPage],
      providers: [
        { provide: PetsFacade, useValue: facade },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) }
          }
        }
      ]
    }).compileComponents();

    TestBed.createComponent(PetDetailPage);
  });

  it('Carrega um Pet', () => {
    const fixture = TestBed.createComponent(PetDetailPage);
    fixture.detectChanges();

    expect(facade.loadPetById).toHaveBeenCalledWith(1);
  });
});
