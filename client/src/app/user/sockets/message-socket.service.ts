import { Injectable,inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { Socket } from 'socket.io-client';
import { Message } from 'src/shared/utils/interface';
@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly tokenService = inject(TokenService);
  private readonly socket: Socket;

  constructor(){
    this.socket = io(this.env.wsUrl+'/message', {
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
    this.socket.on('receive-message',(data:any)=>console.log(data));
  }

  // Get all friend messages
  getMessages(){
    this.socket.emit('get-messages', (data:any) => {
      console.log(data);
    });
    this.sendMessages({
      senderID: '64cf876893baba530cbb88c8',
      receiverID: '64cf877493baba530cbb88cb',
      timestamp: (new Date()).toISOString(),
      content: 'hai , how are u ? ',
      status: 'sent',
      type: 'chat'
    });
  }

  sendMessages(message: Partial<Message>){
    this.socket.emit('send-message',JSON.stringify(message));
  }

}
