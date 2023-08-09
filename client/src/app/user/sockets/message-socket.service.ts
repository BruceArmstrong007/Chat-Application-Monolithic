import { Injectable,inject } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { Socket } from 'socket.io-client';
import { MessageState, MessageStateI, MessageStateT } from '../state/message.state';
@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly messageState = inject(MessageState);
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
    this.listenForMessages();
  }

  listenForMessages(){
    this.socket.on('receive-message',(data) => {
      console.log('room data',data)
    });
  }

  // Get all friend messages and store in state
  getMessages(){
    this.socket.emit('get-messages', (data: MessageStateT) => {
      this.messageState.setMessageState = data;
    });

   // Testing Code below
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
