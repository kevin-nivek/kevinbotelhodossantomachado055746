import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AuthService } from "./auth.service";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade  {
  private platformId = inject(PLATFORM_ID);
  private logged$ = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor(private service: AuthService, private router: Router) {}

  private restore(){
    const token = localStorage.getItem('token');
    this.logged$.next(!!token);
  }

  login(username: string, password: string) {
    return this.service.login(username, password).pipe(tap ( res =>{
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('expires_at', (Date.now() + res.expires_in * 1000).toString());
        }
      ),
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  get token() {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('token');
  }
  get refreshToken() {
    return localStorage.getItem('refresh_token');
  }

  isTokenExpired(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const exp = localStorage.getItem('expires_at');
    return !exp || Date.now() > Number(exp);
  }

  isLogged(){
    return this.service.isLogged()
  }
}
