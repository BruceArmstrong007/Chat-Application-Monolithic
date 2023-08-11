import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, throwError, catchError, map, switchMap } from 'rxjs';
import { environment } from "src/environments/environment";
import { UserService } from "./user.service";
import { ToastController } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly env = environment;
  private toastController: ToastController = inject(ToastController);

  sendInvite(username: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/contact/send-invite',{username:username}).pipe(
      switchMap((res) => this.userService.profile()),
      map((res)=> {
        this.toaster('Invite sent.');
        return res;
      }),
      catchError(this.handleError)
    )
  }

  removeContact(username: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/contact/remove-contact',{username:username}).pipe(
      switchMap((res) => this.userService.profile()),
      map((res)=> {
        this.toaster('Contact removed.');
        return res;
      }),
      catchError(this.handleError)
    )
  }

  cancelInvite(username: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/contact/cancel-invite',{username:username}).pipe(
      switchMap((res) => this.userService.profile()),
      map((res)=> {
        this.toaster('Cancelled invite.');
        return res;
      }),
      catchError(this.handleError)
    )
  }

  acceptInvite(username: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/contact/accept-invite',{username:username}).pipe(
      switchMap((res) => this.userService.profile()),
      map((res)=> {
        this.toaster('Invite accepted.');
        return res;
      }),
      catchError(this.handleError)
    )
  }


  declineInvite(username: string): Observable<any>{
    return this.http.post(this.env.apiUrl+'/contact/decline-invite',{username:username}).pipe(
      switchMap((res) => this.userService.profile()),
      map((res)=> {
        this.toaster('Invite declined.');
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

  async toaster(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }

}
