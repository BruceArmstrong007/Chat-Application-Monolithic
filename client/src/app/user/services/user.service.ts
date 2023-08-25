import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, throwError, catchError, map, switchMap, tap } from 'rxjs';
import { environment } from "src/environments/environment";
import { UserStateT, UserState } from "../state/user.state";
import { ToastController } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly env = environment;
  private readonly userState = inject(UserState);
  private toastController: ToastController = inject(ToastController);

  profile() : Observable<any>{
    return this.http.get(this.env.apiUrl+'/user/profile').pipe(
      map((res : UserStateT) => {
        this.userState.setUser = res;
        return res;
      }),
      catchError(this.handleError)
    )
  }

  updateProfile(data: any) : Observable<any>{
    return this.http.put(this.env.apiUrl+'/user/update', data).pipe(
      switchMap((res : any) => this.profile()),
      tap(() => this.toaster('Profile changed Successfully.')),
      catchError(this.handleError)
    )
  }


  search(key: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/user/search',{search:key}).pipe(
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

  async toaster(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }


  generateRoomIDs(id1: any, id2: any): string{
    return [id1, id2].sort().join('-');
  }
}
