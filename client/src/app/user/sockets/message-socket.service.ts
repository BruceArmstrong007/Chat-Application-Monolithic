import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/shared/services/token.service';
import { MessageState, MessageStateI, MessageStateW } from '../state/message.state';
import { UserService } from '../services/user.service';
import { ContactRef, UserState } from '../state/user.state';
import { NotificationService } from 'src/shared/services/notification.service';
import { UpdateStatus } from 'src/shared/utils/interface';

@Injectable({
  providedIn: 'root'
})
export class MessageSocketService {
  private readonly env = environment;
  private readonly messageState = inject(MessageState);
  private readonly userState = inject(UserState);
  private readonly userContacts : WritableSignal<ContactRef[] | undefined> = signal(this.userState.user()?.contacts);
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
      autoConnect: false,
      transports: ['websocket', 'polling'],
      query: {
        token:  this.tokenService.getToken
      }
    });
    this.connect();


    this.listenForMessages();
    this.listenForTyping();
    this.listenForMessageUpdates();
  }

  connect(){
    this.socket.connect();
  }

  disconnect(){
    this.socket.disconnect();
  }


  // listening for messages send to user realtime
  listenForMessages(){
    this.socket.on('receive-message',async (data) => {
      const roomID = this.userService.generateRoomIDs(data?.senderID,data?.receiverID);
      // Update received message in the Application State
      this.messageState.messageState.update((state:any) => {
        let isNew = true;
        let newState = state?.map((room:any) => {
          if(room?.roomID === roomID){
            let messages =  room?.messages ? room.messages : []
            messages.push(data);
            isNew = false;
            return {
              ...room,
              messages: messages
            }
          }
          return room;
        });
        if(isNew === true){
          newState.push({
            roomID: roomID,
            messages: [data],
            typing: null
          })
        }
        return newState;
      })
      this.socket.emit('message-status',{
        roomID: roomID,
        messageID: [data?.messageID],
        crntStatus: 'delivered',
        prevStatus: 'sent'
      });
      const contact = this.userContacts()?.find((contact:any) => contact?.user?._id === data?.senderID);
      this.notificationService.setBasicNotification(contact?.user?.name +' sent you a message.',data?.content);
    });
  }

  // listening for typing realtime
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

  // listening where message is delivered or seen realtime
  listenForMessageUpdates(){
    this.socket.on('update-status',async (data) => {
      // Bulk update message seen, delivered
      if(data?.messageID.length === 0){
        this.messageState.messageState.update((state:any) => {
          return state?.map((room:any) => {
            if(room?.roomID === data?.roomID){
              const messages = room?.messages?.map((msg:any) => {
                var condition = (msg.status == data?.prevStatus);
                // not necessory
                if(data?.userID == this.userState.getUser?._id && msg.senderID != this.userState.getUser?._id && condition){
                  return {
                    ...msg,
                    status: data?.crntStatus
                  }
                }
                // necessory
                if(data?.userID != this.userState.getUser?._id && msg.senderID == this.userState.getUser?._id && condition){
                  return {
                    ...msg,
                    status: data?.crntStatus
                  }
                }
                return msg;
              })
              return {
                ...room,
                messages
              }
            }
            return room;
          });
        });
      } else {  // update specific message ids
        this.messageState.messageState.update((state:any) => {
          return state?.map((room:any) => {
            if(room?.roomID === data?.roomID){
              const messages = room?.messages?.map((msg:any) => {
                var condition = (msg.status == data?.prevStatus);
                var thisMessage = data?.messageID.find((id: string) => msg?.messageID === id);
                if(thisMessage && condition){
                  return {
                    ...msg,
                    status: data?.crntStatus
                  }
                }
                return msg;
              })
              return {
                ...room,
                messages
              }
            }
            return room;
          });
        });
      }
    });
  }

  // if reciever views user chat, update the delivered to seen realtime
  seenMessages(room: Partial<UpdateStatus>){
    this.socket.emit('message-status',{
      roomID: room.roomID,
      userID: this.userState.getUser?._id,
      messageID: room.messageID,
      crntStatus: 'seen',
      prevStatus: 'delivered'
    });
  }

  // Get all friend messages and store in state
   getMessages(){
    this.socket.emit('get-messages',async (data: any) => {
      const rooms =  data?.map((room: any): MessageStateW=>{
        let message!:any;
        this.socket.emit('message-status',{
          roomID: room.roomID,
          userID: this.userState.getUser?._id,
          messageID: [],
          crntStatus: 'delivered',
          prevStatus: 'sent'
        });
        message = room?.messages[0];
        if(typeof(room?.messages) == 'string'){
          message = JSON.parse(room?.messages);
        }
        return {
         roomID: room.roomID,
         messages: message ? message : [],
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
