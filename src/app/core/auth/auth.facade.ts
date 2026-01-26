import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade  {

  private logged$ = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private service: AuthService, private router: Router) {}

  private restore(){
    const token = localStorage.getItem('token');
    this.logged$.next(!!token);
  }

  login(username: string, password: string) {
    this.service.login(username, password).subscribe(res => {
      console.log(res);

      localStorage.setItem('token', res.access_token);
      localStorage.setItem('refresh_token', res.refresh_token);
      localStorage.setItem('expires_at', (Date.now() + res.expires_in * 1000).toString());
      this.logged$.next(true);
      // this.tokenSubject.next(res.access_token);
      this.router.navigate(['/']);
    });
  }

  get token() {
    return localStorage.getItem('token');
  }
  get refreshToken() {
    return localStorage.getItem('refresh_token');
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem('expires_at');
    return !exp || Date.now() > Number(exp);
  }
}
// PAREI AQUI EM ->  ARQUITETURA CORRETA NO FRONT
