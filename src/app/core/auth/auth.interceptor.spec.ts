import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpResponse,
  HttpHandlerFn
} from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let authFacade: any;
  let authService: any;
  let next: HttpHandlerFn;
  let nextSpy: any;

  beforeEach(() => {
    authFacade = {
      token: 'fake-token',
      refreshToken: 'fake-refresh',
      isTokenExpired: vi.fn()
    };

    authService = {
      refresh: vi.fn()
    };

    next = ((req: HttpRequest<any>) =>
      of(new HttpResponse({ status: 200 }))
    ) as HttpHandlerFn;

    nextSpy = vi.fn(next);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authFacade },
        { provide: AuthService, useValue: authService }
      ]
    });
  });

  it('Permite seguir com request adicionando o bearer token', () => {
    authFacade.isTokenExpired.mockReturnValue(false);

    const req = new HttpRequest('GET', '/pets');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy).subscribe();
    });

    const calledReq = nextSpy.mock.calls[0][0];
    expect(calledReq.headers.get('Authorization'))
      .toBe('Bearer fake-token');
  });
});
