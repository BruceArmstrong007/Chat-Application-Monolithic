import { Component, Input, OnInit, Signal, ViewChild, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ModalController } from '@ionic/angular';
import { UserStateI } from 'src/app/user/state/user.state';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessageState } from 'src/app/user/state/message.state';
import { UserService } from '../../../app/user/user.service';
import { MessageSocketService } from 'src/app/user/sockets/message-socket.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone:true,
  imports: [IonicModule, FormsModule, MessageCardComponent, NgFor]
})
export class MessagesComponent  implements OnInit {
  @Input() user!: UserStateI;
  @Input() contact!: UserStateI;
  @ViewChild('content', { static: false }) content!: IonContent;
  private readonly messageState = inject(MessageState);
  private readonly userService = inject(UserService);
  private readonly messageSocket = inject(MessageSocketService);
  private readonly modalCtrl = inject(ModalController);
  roomData!: Signal<any>;
  message!: string;

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  ngOnInit() {

    this.roomData = computed(() => {
      // side effect - scroll
      setTimeout(()=>this.content?.scrollToBottom(300),100);

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


}
