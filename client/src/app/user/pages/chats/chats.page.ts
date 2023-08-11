import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserRef, UserState } from '../../state/user.state';
import { ChatsCardComponent } from 'src/app/user/pages/chats/chats-card/chats-card.component';
import { MessagesComponent } from 'src/shared/components/messages/messages.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ChatsCardComponent, NgFor, NgIf]
})
export class ChatsPage implements OnInit {
  private readonly userState = inject(UserState);
  private readonly modalCtrl: ModalController = inject(ModalController);
  readonly contacts: Signal<UserRef | undefined> = computed(() => this.userState?.user()?.contacts);

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
  }
}


