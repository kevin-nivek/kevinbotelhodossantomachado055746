import { Router } from '@angular/router';
import { AuthFacade } from "../../core/auth/auth.facade";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AlertService } from '../../shared/components/alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
})
export class LoginPage  implements OnInit {

  login = '';
  senha = '';

  constructor(private auth: AuthFacade, private router: Router, private alert: AlertService) {}
  ngOnInit(): void {
    if(this.auth.isLogged()){
      this.router.navigate(['/pets'])
    }
  }
  entrar() {
    this.auth.login(this.login, this.senha).subscribe({
      next:() => {
        this.alert.success('Login realizado com sucesso')
        this.router.navigate(['/pets'])
      },
      error: (err) => {
        if(err.status == 401 || err.status == 403){
          this.alert.error('Usúario ou senha inválidos');
        }else{
          this.alert.error('Erro ao realizar Login')
        }
      }
    }

    )

  }
}
