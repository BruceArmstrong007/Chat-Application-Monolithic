import { Injectable, WritableSignal, signal, inject } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly darkTheme: WritableSignal<boolean> = signal(false);
  private readonly storageService = inject(StorageService);

  constructor(){
  }

  async init(){
    const theme = await this.storageService.get('mode');
    this.setTheme = theme == 'true' ? true : false;
  }

  get getTheme(){
    return this.darkTheme();
  }

  set setTheme(value: boolean){
    this.darkTheme.set(value);
    this.storageService.set('mode', value.toString());
  }
}
