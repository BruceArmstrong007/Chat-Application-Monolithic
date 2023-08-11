import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/shared/utils/interface';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { TokenService } from 'src/shared/services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})
export class AuthService{
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly env = environment;

  login(data: Partial<User>): Observable<any>{
    return this.http.post(this.env.apiUrl+'/auth/login',data).pipe(
      map((res:any)=> {
        localStorage.setItem('token', res.refreshToken);
        this.tokenService.setToken = res.accessToken;
        this.router.navigateByUrl('user');
    }),
      catchError(this.handleError))
  }

  register(data: User): Observable<any>{
    return this.http.post(this.env.apiUrl+'/auth/register',data).pipe(
      map((res) => this.router.navigateByUrl('auth')),
      catchError(this.handleError))
  }

  resetPassword(data: User): Observable<any>{
    return this.http.post(this.env.apiUrl+'/auth/reset-password',data).pipe(
      catchError(this.handleError))
  }

  logout(): Observable<any>{
    localStorage.removeItem('token');
    this.tokenService.setToken = '';
    this.router.navigateByUrl('auth');
    return this.http.get(this.env.apiUrl+'/auth/logout').pipe(
      catchError(this.handleError))
  }

  refreshToken(data: unknown): Observable<any>{
    return this.http.post(this.env.apiUrl+'/auth/refresh',data).pipe(
      map((res: any) => {
        this.tokenService.setToken = res?.accessToken;
        return res;
      }),
      catchError(this.handleError))
  }




  private handleError(Response: HttpErrorResponse){
    switch(Response?.error.statusCode){
      case 401:
        console.log('Invalid Username / Password.');
        break;
      case 422:
        console.log('User already exist.');
        break;
    }
    return throwError(() => Response);
  }

}
