import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, switchMap, tap, throwError } from "rxjs";
import { AuthFacade } from "./auth.facade";
import { AuthService } from "./auth.service";
import { isPlatformBrowser } from "@angular/common";
import { HealthFacade } from "../health/health.facade";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const health = inject(HealthFacade);
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  if (
    req.url.includes('/autenticacao/login') ||
    req.url.includes('/autenticacao/refresh')
  ) {
    return next(req);
  }
  const handleAuthError = (err: any) => {
    if(err.status == 0){
      health.changeStatus("DOWN")
      return throwError(()=> err);
    }
    if (err.status === 401 || err.status === 403) {
      localStorage.clear();
      router.navigate(['/login']);
    }
    return throwError(() => err);
  };


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
      tap(() => health.changeStatus("UP")),
      catchError(handleAuthError)
    )
  }

  const token = auth.token;
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    tap(() => health.changeStatus("UP")),
    catchError(handleAuthError)
  );
};
