import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class PersistResolver implements Resolve<boolean> {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = this.tokenService.getRefreshToken;
    if(token){
      return this.authService.refreshToken({
        refresh: token
      }).pipe(map((res)=>{
        this.router.navigateByUrl('user')
        // doesn't go to auth route
        return false
      }))
    }
    return of(true);
  }
}
