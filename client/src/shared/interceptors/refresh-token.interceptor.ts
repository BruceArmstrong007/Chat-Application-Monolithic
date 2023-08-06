import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../app/auth/auth.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthHeader(request)).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(request.url.endsWith('auth/refresh') || !this.tokenService.getToken){
      return this.authService.logout();
    }

    if (this.tokenService.getToken) {
      return this.authService.refreshToken({
        refresh : localStorage.getItem('token')
      }).pipe(
        switchMap((response) => {
          return next.handle(this.addAuthHeader(request));
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.tokenService.getToken;
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }

}
