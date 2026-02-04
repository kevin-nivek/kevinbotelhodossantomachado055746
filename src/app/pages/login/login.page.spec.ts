import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthFacade } from '../../core/auth/auth.facade';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authFacade: any;

  beforeEach(async () => {
    authFacade = {
      login: vi.fn().mockReturnValue(of({})),
      isLogged: vi.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule],
      providers: [
        { provide: AuthFacade, useValue: authFacade },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Cria pagina de Login', () => {
    expect(component).toBeTruthy();
  });


  it('Teste de Login sucesso', () => {
    component.login = 'admin',
    component.senha = 'admin'
    component.entrar();

    expect(authFacade.login).toHaveBeenCalledWith('admin', 'admin');
  });
});
