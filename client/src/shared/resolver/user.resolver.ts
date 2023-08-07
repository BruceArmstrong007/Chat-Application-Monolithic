import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
  private readonly userService = inject(UserService);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.profile().pipe(map((res) => {
      if(res){
        return true;
      }
      return false;
    }));
  }
}
