import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService {
  private readonly env = environment;
  private readonly socket: Socket;
  private readonly tokenService = inject(TokenService);


  constructor() {
    this.socket = io(this.env.wsUrl+'/event', {
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


}
