import { Injectable,inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class UserSocketService {
  private readonly env = environment;
  private readonly tokenService = inject(TokenService);
  private readonly socket: Socket;

  constructor(){
    this.socket = io(this.env.wsUrl+'/user', {
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      query: {
        token:  this.tokenService.getToken
      }
    });

  }

  establishConnection(){
    this.userOnline();
    const online = setInterval(() => {
      if(!this.tokenService.getToken){
        clearInterval(online);
        return;
      }
      this.userOnline();
    },60 * 1000)
  }

  userOnline(){
    // Set user as online
    this.socket.emit('online');

    // Get user's friends that are online
    this.socket.emit('online-friends',(res:any)=>{
      console.log(res)
    });
  }


}
