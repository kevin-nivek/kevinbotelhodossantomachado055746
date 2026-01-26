import { Router } from '@angular/router';
import { AuthFacade } from "../../core/auth/auth.facade";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
})
export class LoginPage {

  login = '';
  senha = '';

  constructor(private auth: AuthFacade, private router: Router) {}

  entrar() {
    this.auth.login(this.login, this.senha)

  }
}
