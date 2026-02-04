import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      login: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    facade = TestBed.inject(AuthFacade);
    localStorage.clear();
  });

  it('faz login com sucesso', () => {
    authService.login.mockReturnValue(
      of({
        access_token: 'token123',
        refresh_token: 'refresh123',
        expires_in: 3600
      })
    );

    facade.login('admin', '123').subscribe();

    expect(authService.login).toHaveBeenCalledWith('admin', '123');
    expect(localStorage.getItem('token')).toBe('token123');
    expect(localStorage.getItem('refresh_token')).toBe('refresh123');
  });

  it('retorna token', () => {
    localStorage.setItem('token', 'abc');
    expect(facade.token).toBe('abc');
  });

  it('retorna refresh token', () => {
    localStorage.setItem('refresh_token', 'ref');
    expect(facade.refreshToken).toBe('ref');
  });

  it('retorna true se token estiver expirado', () => {
    localStorage.setItem('expires_at', (Date.now() - 1000).toString());
    expect(facade.isTokenExpired()).toBe(true);
  });

  it('retorna false se token for válido', () => {
    localStorage.setItem('expires_at', (Date.now() + 60000).toString());
    expect(facade.isTokenExpired()).toBe(false);
  });
});
