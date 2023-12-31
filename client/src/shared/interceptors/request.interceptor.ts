import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../app/auth/services/auth.service';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  constructor(){
  }

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAuthHeader(request)).pipe(
      catchError((response : HttpErrorResponse) => {
          return this.handle401Error(request, next, response);
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler, response: HttpErrorResponse){
    if(request.url.endsWith('refresh')){
     this.authService.logout().subscribe((res) => res);
    }

    if (this.tokenService.getToken) {
      // localStorage.getItem('token')
      return this.authService.refreshToken({
        refresh : this.tokenService.getRefreshToken
      }).pipe(
        switchMap((response) => {
          return next.handle(this.addAuthHeader(request));
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
    }
    return throwError(()=> response);
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
