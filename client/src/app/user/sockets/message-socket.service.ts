import { Injectable,inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly tokenService = inject(TokenService);
  private readonly socket = io(this.env.apiUrl+'/user', {
    forceNew: true,
    query: { token: this.tokenService.getToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    autoConnect: true,
    transports: ['websocket', 'polling']
  });

  userOnline(){
    const online = setInterval(() => {
      if(!this.tokenService.getToken){
        clearInterval(online);
        return;
      }
      this.socket.emit('online');
      this.socket.emit('online-friends');
    },1000)
    this.socket.on('online-friends',(res)=>{
      console.log(res)
    })
  }


}
