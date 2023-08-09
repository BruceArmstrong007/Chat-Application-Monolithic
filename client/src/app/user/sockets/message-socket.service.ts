import { Injectable,inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { Socket } from 'socket.io-client';
import { UserState, UserStateI } from '../state/user.state';
import { MessageStateI } from '../state/message.state';
@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly tokenService = inject(TokenService);
  private readonly userState = inject(UserState);
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
    // this.socket.on('receive-message',(data:any)=>console.log(data));
    this.connectWithFriends();
  }

  connectWithFriends(){
    const user = this.userState.getUser as UserStateI;
    this.socket.on('receive-message',(data) => {
      console.log('room data',data)
    })

  }

  // Get all friend messages
  getMessages(){
    this.socket.emit('get-messages', (data:any) => {
      console.log(data);
    });
    setTimeout(()=>{
      console.log('sending');

      this.sendMessages({
        senderID: '64cf876893baba530cbb88c8',
        receiverID: '64cf877493baba530cbb88cb',
        timestamp: (new Date()).toISOString(),
        content: 'hai , how are u ? ',
        status: 'sent',
        type: 'chat'
      });
    }, 8 * 1000)


    setTimeout(()=>{
      console.log('sending');

      this.sendMessages({
        senderID: '64cf876893baba530cbb88c8',
        receiverID: '64cf877493baba530cbb88cb',
        timestamp: (new Date()).toISOString(),
        content: 'hai , how are u ? ',
        status: 'sent',
        type: 'typing'
      });
    }, 5 * 1000)
  }

  sendMessages(message: Partial<MessageStateI>){
    this.socket.emit('send-message',JSON.stringify(message));
  }

}
