import { Component, Input, OnInit, Signal, ViewChild, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ModalController } from '@ionic/angular';
import { UserState, UserStateI } from 'src/app/user/state/user.state';
import { MessageCardComponent } from './message-card/message-card.component';
import { MessageState } from 'src/app/user/state/message.state';
import { UserService } from '../../../app/user/services/user.service';
import { MessageSocketService } from 'src/app/user/sockets/message-socket.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, MessageCardComponent, NgFor, NgIf]
})
export class MessagesComponent  implements OnInit {
  @Input() user!: UserStateI;
  @Input() contact!: UserStateI;
  @ViewChild('content', { static: false }) content!: IonContent;
  private readonly messageState = inject(MessageState);
  private readonly userService = inject(UserService);
  private readonly messageSocket = inject(MessageSocketService);
  private readonly modalCtrl = inject(ModalController);
  private readonly usersState = inject(UserState);
  isOnline!: Signal<boolean>;
  roomData!: Signal<any>;
  isTyping!: Signal<any>;
  message!: string;

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  ngOnInit() {
    this.isOnline = computed(() => {
      let state = false;
      this.usersState.onlineUsers()?.forEach((onlineUser:any) => {
        if(onlineUser.id === this.contact._id){
          state = onlineUser.isOnline;
        }
      });
      return state;
    });

    this.isTyping = computed(() => {
      let typing: any[] = [];
      this.messageState.messageState()?.forEach((room) => {
        if(room?.roomID === this.userService.generateRoomIDs(this.usersState.user()?._id,this.contact._id)){
          typing = room?.typing?.length ? room?.typing : [];
        }
      });
      return typing;
    });

    this.roomData = computed(() => {
      // side effect - scroll
      setTimeout(()=>this.content?.scrollToBottom(300),300);

      let roomData;
      this.messageState?.messageState()?.forEach((room:any) => {
        if(room?.roomID === this.userService.generateRoomIDs(this.user._id,this.contact._id)){
          roomData = {
            ...room,
            messages: room.messages ?  room?.messages : []
          }
        }
      });
      return roomData;
    });

  }

  send(){
    this.messageSocket.sendMessages({
      senderID: this.user._id,
      receiverID: this.contact._id,
      timestamp: (new Date()).toISOString(),
      content: this.message,
      status: 'sent',
      type: 'chat'
    });

    this.message = '';
  }

  onTyping(){
    this.messageSocket.userTyping({
      senderID: this.user._id,
      receiverID: this.contact._id,
      status: 'started',
      type: 'typing'
    });
  }

  onFinishedTyping(){
    this.messageSocket.userTyping({
      senderID: this.user._id,
      receiverID: this.contact._id,
      status: 'finished',
      type: 'typing'
    });
  }


}
