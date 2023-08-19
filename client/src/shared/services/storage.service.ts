import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage!: Storage;

  constructor(){
  }


  async init(){
    const storage =  new Storage();
    this.storage = await storage.create();
  }

  public async set(key:string, value:string){
    await this.storage?.set(key,value);
  }

  public async get(key:string){
    return await this.storage.get(key);
  }

  public async clear(){
    await this.storage.clear();
  }

  public async remove(key:string){
    await this.storage.remove(key);
  }



}
