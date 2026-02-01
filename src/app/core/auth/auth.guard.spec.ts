import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let router: any;

  const fakeRoute: any = {};
  const fakeState: any = {};

  beforeEach(() => {
    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Acessa se tem Token', () => {
    localStorage.setItem('token', 'fake-token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard(fakeRoute, fakeState)
    );

    expect(result).toBe(true);
  });

  it('Redireciona se nao tem Token', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard(fakeRoute, fakeState)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
