import { Injectable, WritableSignal, signal } from '@angular/core';

export type tokenType = string | null;

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly token : WritableSignal<tokenType> = signal(null);

  get getToken(){
    return this.token();
  }

  set setToken(value : tokenType){
    this.token.set(value);
  }

}
