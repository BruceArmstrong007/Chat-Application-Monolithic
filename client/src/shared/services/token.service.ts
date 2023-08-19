import { Injectable, WritableSignal, signal, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type tokenType = string;

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token : WritableSignal<tokenType> = signal('');
  private refreshToken: WritableSignal<tokenType> = signal('');
  private readonly storageService = inject(StorageService);

  async init(){
    this.setRefreshToken = await this.storageService.get('token');
  }

  get getToken(){
    return this.token();
  }

  set setToken(value : tokenType){
    this.token.set(value);
  }

  get getRefreshToken(){
    return this.refreshToken();
  }

  set setRefreshToken(value : tokenType){
    this.refreshToken.set(value);
    this.storageService.set('token',value);
  }

  removeToken(){
    this.refreshToken.set('');
    this.storageService.remove('token');
  }

}
