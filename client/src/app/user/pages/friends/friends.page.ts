import { Component, OnInit, Signal, WritableSignal, signal, inject, computed } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault, NgFor, NgIf } from '@angular/common';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { UserRef, UserState } from '../../state/user.state';
import { FriendsCardComponent } from './friends-card/friends-card.component';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonicModule, NgFor, NgSwitch, NgIf, NgSwitchCase, NgSwitchDefault, FriendsCardComponent]
})
export class FriendsPage implements OnInit {
  private readonly contactService = inject(ContactService);
  currentSection: WritableSignal<string> = signal('friends');
  private readonly userState = inject(UserState);
  readonly contacts: Signal<UserRef | undefined> = computed(() => this.userState?.user()?.contacts);
  readonly sentInv: Signal<UserRef | undefined> = computed(() => this.userState?.user()?.sentInvites);
  readonly receivedInv: Signal<UserRef | undefined> = computed(() => this.userState?.user()?.receivedInvites);
  private readonly actionSheetCtrl: ActionSheetController = inject(ActionSheetController);

  constructor() { }

  ngOnInit() {
  }

  changeSection(event:any){
    this.currentSection.set(event.target.value);
  }

  btnClick(event:any){
    switch(event.type){
      case 'remove':
        this.removeUser(event?.username);
        break;
      case 'cancel':
        this.cancelInvite(event?.username);
        break;
      case 'accept':
        this.acceptInvite(event?.username);
        break;
      case 'decline':
        this.declineInvite(event?.username);
        break;
      default:
    }
  }

  async removeUser(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Remove User',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          data: {
            action: 'remove-user',
          },
          handler:() =>  {
            this.contactService.removeContact(username).subscribe((res) => console.log(res))
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async cancelInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cancel Invite',
      buttons: [
        {
          text: 'Cancel',
          role: 'destructive',
          data: {
            action: 'cancel-invite',
          },
          handler:() =>  {
            this.contactService.cancelInvite(username).subscribe((res) => console.log(res))
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }


  async acceptInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Accept Invite',
      buttons: [
        {
          text: 'Accept',
          data: {
            action: 'accept-invite',
          },
          handler:() =>  {
            this.contactService.acceptInvite(username).subscribe((res) => console.log(res))
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async declineInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Decline Invite',
      buttons: [
        {
          text: 'Decline',
          role: 'destructive',
          data: {
            action: 'decline-invite',
          },
          handler:() =>  {
            this.contactService.declineInvite(username).subscribe((res) => console.log(res))
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  open(event:any){

  }
}
