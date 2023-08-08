import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, WritableSignal, inject, signal } from "@angular/core";
import { Observable, throwError, catchError, map } from 'rxjs';
import { environment } from "src/environments/environment";

export interface UserProfile {
    _id: string,
    username: string,
    name: string,
    bio: string,
    profileURL: string,
    contacts: Partial<UserProfile>[],
    sentInvites: Partial<UserProfile>[],
    receivedInvites: Partial<UserProfile>[],
    createdAt: string,
    updatedAt: string
}

export type ProfileType = Partial<UserProfile> | null;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly env = environment;
  private user : WritableSignal<ProfileType> = signal(null);


  get getUser(){
    return this.user();
  }

  set setUser(value : ProfileType){
    this.user.set(value);
  }

  profile() : Observable<any>{
    return this.http.get(this.env.apiUrl+'/user/profile').pipe(
      map((res : ProfileType) => {
        this.setUser = res;
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
