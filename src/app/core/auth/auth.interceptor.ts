import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthFacade } from "./auth.facade";
import { AuthService } from "./auth.service";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(req.url);

if (
    req.url.includes('/autenticacao/login') ||
    req.url.includes('/autenticacao/refresh')
  ) {
    return next(req);
  }
  if (auth.isTokenExpired()) {
    return authService.refresh(auth.refreshToken!).pipe(
      switchMap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refresh_token', res.refresh_token);
        localStorage.setItem('expires_at', (Date.now() + res.expires_in * 1000).toString());
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${res.token}`
          }
        });
        return next(clonedReq);
      }),
      catchError(err => {
        if (err.status === 401) {
          localStorage.clear();
          router.navigate(['/login']);
        }

        return throwError(() => err);
      })
    )
  }

  const token = auth.token;
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
