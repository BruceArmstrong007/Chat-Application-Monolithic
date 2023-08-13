import { Injectable,inject, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { MessageState, MessageStateI, MessageStateW } from '../state/message.state';
import { UserService } from '../services/user.service';
import { UserState } from '../state/user.state';
import { NotificationService } from 'src/shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly messageState = inject(MessageState);
  private readonly userContacts = signal(inject(UserState).user()?.contacts);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
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
    this.listenForTyping();
  }

  listenForMessages(){
    this.socket.on('receive-message',async (data) => {

      // Update received message in the Application State
      this.messageState.messageState.update((state:any) => {
        return state?.map((room:any) => {
          if(room?.roomID === this.userService.generateRoomIDs(data?.senderID,data?.receiverID)){
            let messages =  room?.messages ? room.messages : []
            messages.push(data);
            return {
              ...room,
              messages: messages
            }
          }
          return room;
        })
      })

        const contact = this.userContacts()?.find((contact:any) => contact?._id === data?.senderID);
        this.notificationService.setBasicNotification(contact?.name +' sent you a message.',data?.content);
    });
  }

  listenForTyping(){
    this.socket.on('typing',(data) => {
      this.messageState.messageState.update((state:any) => {
        return state?.map((room:any) => {
          if(room?.roomID === this.userService.generateRoomIDs(data?.senderID,data?.receiverID)){
            let typing = room?.typing ? room.typing : [];
            if(data?.status === 'started'){
              if(!typing.find((user:any) => user?.senderID !== data?.senderID)){
                typing.push(data);
              }
            }
            if(data?.status === 'finished'){
              typing = typing.filter((user:any)=> user?.senderID !== data?.senderID)
            }
            return {
              ...room,
              typing : typing
            }
          }
          return room;
        })
      })
    });
  }

  // Get all friend messages and store in state
   getMessages(){
    this.socket.emit('get-messages',async (data: any) => {
      const rooms =  data?.map((room: any): MessageStateW=>{
        const message = JSON.parse(room?.messages)
        return {
         roomID: room.roomID,
         messages: message[0] ? message[0] : [],
         typing: null
        }
      });
      this.messageState.setMessageState = rooms;
    });

  }



  sendMessages(message: Partial<MessageStateI>){
    this.socket.emit('send-message',message);
  }

  userTyping(message: Partial<MessageStateI>){
    this.socket.emit('user-typing',message);
  }


}
