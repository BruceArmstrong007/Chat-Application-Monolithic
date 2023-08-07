import { Injectable, WritableSignal, signal } from '@angular/core';

export type tokenType = string;

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token : WritableSignal<tokenType> = signal('');

  get getToken(){
    return this.token();
  }

  set setToken(value : tokenType){
    this.token.set(value);
  }


}
