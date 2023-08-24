import { Component, OnInit, Signal, WritableSignal, signal, inject, computed, effect } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault, NgFor, NgIf } from '@angular/common';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { ContactRef, UserState } from '../../state/user.state';
import { FriendsCardComponent } from './friends-card/friends-card.component';
import { ContactService } from '../../services/contact.service';
import { SectionStatus } from '../../../../shared/utils/interface';

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
  readonly contacts: Signal<ContactRef[] | undefined> = computed(() => this.userState?.user()?.contacts);
  readonly sentInv: Signal<ContactRef[] | undefined> = computed(() => this.userState?.user()?.sentInvites);
  readonly receivedInv: Signal<ContactRef[] | undefined> = computed(() => this.userState?.user()?.receivedInvites);
  private readonly actionSheetCtrl: ActionSheetController = inject(ActionSheetController);

  readonly sectionStatus: Signal<SectionStatus> = computed(() => {
    const contacts = this.contacts()?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    const sentInv = this.sentInv()?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    const receivedInv = this.receivedInv()?.filter((contact:ContactRef) => contact?.status == 'sent').length;
    return {
      contacts: contacts ? contacts : 0,
      sentInv: sentInv ? sentInv : 0,
      receivedInv: receivedInv ? receivedInv : 0
    }
  })

  constructor() {
    effect(() => {
      const sectionStatus = this.sectionStatus();
      const crntSection = this.currentSection();
      if(crntSection ==  'friends' && sectionStatus?.contacts > 0){
        this.contactService.seenSection('contacts').subscribe(() => {});
      }
      if(crntSection ==  'sent' && sectionStatus?.sentInv > 0){
        this.contactService.seenSection('sentInvites').subscribe(() => {});
      }
      if(crntSection ==  'received' && sectionStatus?.receivedInv > 0){
        this.contactService.seenSection('receivedInvites').subscribe(() => {});
      }
    })

  }

  ngOnInit() {
  }

  changeSection(event:any){
    this.currentSection.set(event.target.value);
  }

  btnClick(event:any){
    switch(event.type){
      case 'remove':
        this.removeUser(event?.user);
        break;
      case 'cancel':
        this.cancelInvite(event?.user);
        break;
      case 'accept':
        this.acceptInvite(event?.user);
        break;
      case 'decline':
        this.declineInvite(event?.user);
        break;
      default:
    }
  }

  async removeUser(user: any){
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
            this.contactService.removeContact(user?._id, user?.username).subscribe((res) => {})
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

  async cancelInvite(user: any){
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
            this.contactService.cancelInvite(user?.username).subscribe((res) => {})
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

  async acceptInvite(user: any){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Accept Invite',
      buttons: [
        {
          text: 'Accept',
          data: {
            action: 'accept-invite',
          },
          handler:() =>  {
            this.contactService.acceptInvite(user?.username).subscribe((res) => {})
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

  async declineInvite(user: any){
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
            this.contactService.declineInvite(user?.username).subscribe((res) => {})
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

  contactID(index: number, contact: any){
    return contact?.user?._id
  }
}
