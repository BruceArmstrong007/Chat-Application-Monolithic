import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ContactRef, UserState } from '../../state/user.state';
import { ChatsCardComponent } from 'src/app/user/pages/chats/chats-card/chats-card.component';
import { MessagesComponent } from 'src/shared/components/messages/messages.component';
import { MessageSocketService } from '../../sockets/message-socket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ChatsCardComponent, NgFor, NgIf]
})
export class ChatsPage implements OnInit {
  private readonly userState = inject(UserState);
  private readonly userService = inject(UserService);
  private readonly messageSocketService = inject(MessageSocketService);
  private readonly modalCtrl: ModalController = inject(ModalController);
  readonly contacts: Signal<ContactRef[] | undefined> = computed(() => this.userState?.user()?.contacts);

  constructor() { }

  ngOnInit() {
  }

  async openMessages(event: any){
    const modal = await this.modalCtrl.create({
      component: MessagesComponent,
      componentProps: {
        contact: event?.contact,
        user: this.userState.getUser
      },
    });
    modal.present();
    const room = {
      roomID: this.userService.generateRoomIDs(event?.contact?._id, this.userState.getUser?._id),
      messageID: []
    }
    this.messageSocketService.seenMessages(room);
  }
}


