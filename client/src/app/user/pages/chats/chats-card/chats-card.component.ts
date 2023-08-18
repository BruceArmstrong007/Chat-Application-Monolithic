import { Component, Input, OnInit, Output, EventEmitter, inject, Signal, computed } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserState, UserStateI } from 'src/app/user/state/user.state';
  import { NgClass, NgFor, NgIf } from '@angular/common';
import { MessageState } from '../../../state/message.state';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-chats-card',
  templateUrl: './chats-card.component.html',
  styleUrls: ['./chats-card.component.scss'],
  standalone: true,
  imports:[IonicModule ,NgClass, NgFor, NgIf]
})
export class ChatsCardComponent {
  @Input() contact!: UserStateI;
  private readonly usersState = inject(UserState);
  private readonly messageState = inject(MessageState);
  private readonly userService = inject(UserService);
  @Output() cardClick = new EventEmitter();
  isOnline: Signal<boolean> = computed(() => {
    let state = false;
    this.usersState.onlineUsers()?.forEach((onlineUser:any) => {
      if(onlineUser.id === this.contact._id){
        state = onlineUser.isOnline;
      }
    });
    return state;
  });
  isTyping: Signal<any> = computed(() => {
    let typing: any[] = [];
    this.messageState.messageState()?.forEach((room) => {
      if(room?.roomID === this.userService.generateRoomIDs(this.usersState.user()?._id,this.contact._id)){
        typing = room?.typing?.length ? room?.typing : [];
      }
    });
    return typing;
  });
  lastMessage: Signal<string | undefined> = computed(() => {
    let messages!: any, message!: any;
    this.messageState.messageState()?.forEach((room) => {
      if(room?.roomID === this.userService.generateRoomIDs(this.usersState.user()?._id,this.contact._id)){
        messages = room?.messages;
        if(messages?.length > 0) message = messages[messages?.length - 1]?.content;
      }
    });
    return message;
  });
  deliveredCount: Signal<number> = computed(() => {
    let count!: number;
    this.messageState.messageState()?.forEach((room) => {
      if(room?.roomID === this.userService.generateRoomIDs(this.usersState.user()?._id,this.contact._id)){
        count = room?.messages.filter((msg:any)=> msg.senderID == this.contact?._id && msg.status === 'delivered').length;
      }
    });
    return count ? count : 0;
  });
  constructor() { }


}
