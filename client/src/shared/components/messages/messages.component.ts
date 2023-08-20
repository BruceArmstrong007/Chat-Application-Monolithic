import { Component, Input, Signal, ViewChild, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ModalController } from '@ionic/angular';
import { ContactRef, UserState, UserStateI } from 'src/app/user/state/user.state';
import { MessageCardComponent } from './message-card/message-card.component';
import { MessageState } from 'src/app/user/state/message.state';
import { UserService } from '../../../app/user/services/user.service';
import { MessageSocketService } from 'src/app/user/sockets/message-socket.service';
import { NgClass, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, MessageCardComponent, NgFor, NgIf, NgClass]
})
export class MessagesComponent {
  @Input() user!: UserStateI;
  @Input() contact!: ContactRef;
  @ViewChild('content', { static: false }) content!: IonContent;
  private readonly messageState = inject(MessageState);
  private readonly userService = inject(UserService);
  private readonly messageSocket = inject(MessageSocketService);
  private readonly modalCtrl = inject(ModalController);
  private readonly usersState = inject(UserState);
  isOnline: Signal<boolean> = computed(() => {
    let state = false;
    this.usersState.onlineUsers()?.forEach((onlineUser:any) => {
      if(onlineUser.id === this.contact?.user?._id){
        state = onlineUser.isOnline;
      }
    });
    return state;
  });
  roomData: Signal<any> = computed(() => {
    let roomData: any;
    this.messageState?.messageState()?.forEach((room:any) => {
      if(room?.roomID === this.userService.generateRoomIDs(this.user._id,this.contact?.user?._id)){
        roomData = {
          ...room,
          messages: room.messages ?  room?.messages : []
        }
      }
    });
    return roomData;
  });
  isTyping: Signal<any> =  computed(() => {
    let typing: any[] = [];
    this.messageState.messageState()?.forEach((room) => {
      if(room?.roomID === this.userService.generateRoomIDs(this.usersState.user()?._id,this.contact?.user?._id)){
        typing = room?.typing?.length ? room?.typing : [];
      }
    });
    return typing;
  });
  message!: string;

  constructor(){

    effect(()=> {
      const roomData = this.roomData();
      // side effect - scroll
      setTimeout(()=>this.content?.scrollToBottom(300),300);

      // update status as seen when receiver is also in chat page
      let msgID = roomData?.messages?.filter((msg:any) => msg.status == 'delivered' && msg.senderID != this.user?._id).map((msg:any) => msg.messageID);
      if(msgID && msgID.length > 0){
        const room = {
          roomID: roomData?.roomID,
          messageID: msgID
        }
        this.messageSocket.seenMessages(room);
      }
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }




  send(){
    if(this.message){
      this.messageSocket.sendMessages({
        senderID: this.user._id,
        receiverID: this.contact?.user?._id,
        timestamp: (new Date()).toISOString(),
        content: this.message,
        status: 'sent',
        type: 'chat'
      });
    }

    this.message = '';
  }

  onTyping(){
    this.messageSocket.userTyping({
      senderID: this.user._id,
      receiverID: this.contact?.user?._id,
      status: 'started',
      type: 'typing'
    });
  }

  onFinishedTyping(){
    this.messageSocket.userTyping({
      senderID: this.user._id,
      receiverID: this.contact?.user?._id,
      status: 'finished',
      type: 'typing'
    });
  }


}
