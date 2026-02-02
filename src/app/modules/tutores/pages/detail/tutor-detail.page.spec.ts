import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';

import { TutorDetailPage } from './tutor-detail.page';
import { TutoresFacade } from '../../facades/tutores.facade';

describe('TutorDetailPage', () => {
  let facade: any;

  beforeEach(async () => {
    facade = {
      loadTutorById: vi.fn(),
      selectedTutor$: of({ id: 1, nome: 'Kevin', cpf: '12312312' })
    };

    await TestBed.configureTestingModule({
      imports: [TutorDetailPage],
      providers: [
        { provide: TutoresFacade, useValue: facade },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) }
          }
        }
      ]
    }).compileComponents();

    TestBed.createComponent(TutorDetailPage);
  });

  it('Carrega um Tutor', () => {
    const fixture = TestBed.createComponent(TutorDetailPage);
    fixture.detectChanges();

    expect(facade.loadTutorById).toHaveBeenCalledWith(1);
  });
});
