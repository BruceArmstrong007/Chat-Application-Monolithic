import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, throwError, catchError, map } from 'rxjs';
import { environment } from "src/environments/environment";
import { ProfileType, UserState } from "./state/user.state";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly env = environment;
  private readonly userState = inject(UserState);


  profile() : Observable<any>{
    return this.http.get(this.env.apiUrl+'/user/profile').pipe(
      map((res : ProfileType) => {
        this.userState.setUser = res;
        return res;
      }),
      catchError(this.handleError)
    )
  }


  private handleError(Response: HttpErrorResponse){
    switch(Response?.error.statusCode){
      case 401:
        console.log('Token Expired.');
        break;
      case 422:
        console.log('Record already exist.');
        break;
    }
    return throwError(() => Response);
  }

  generateRoomIDs(id1: any, id2: any): string{
    return [id1, id2].sort().join('-');
  }
}
