import { Component, Signal, computed, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserSocketService } from './sockets/user-socket.service';
import { MessageSocketService } from './sockets/message-socket.service';
import { ContactRef, UserState } from './state/user.state';
import { SectionStatus } from 'src/shared/utils/interface';
import { MessageState } from './state/message.state';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class UserPage{
  private readonly userSocket = inject(UserSocketService);
  private readonly userState = inject(UserState);
  private readonly messageSocket = inject(MessageSocketService);
  private readonly messageState = inject(MessageState);
  readonly friendSectionCount: Signal<number> = computed(() => {
    let count = 0;
    const contacts = this.userState?.user()?.contacts;
    const sentInv = this.userState?.user()?.sentInvites;
    const receivedInv = this.userState?.user()?.receivedInvites;
    const cLength = contacts?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    const sLength = sentInv?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    const rLength = receivedInv?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    if(cLength) count += cLength;
    if(sLength) count += sLength;
    if(rLength) count += rLength;
    return count;
  });
  readonly messageSectionCount: Signal<number> = computed(() => {
    let count: number = 0;
    this.messageState.messageState()?.forEach((room) => {
        let temp = room?.messages.filter((msg:any)=> msg.senderID != this.userState?.user()?._id && msg.status === 'delivered').length;
        if(temp) count += temp;
      });
    return count;
  });

  constructor() {

    this.userSocket.establishConnection();
    this.messageSocket.getMessages();
  }

}
