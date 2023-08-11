import { Component, OnInit, inject, WritableSignal, signal } from '@angular/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { SearchCardComponent } from './search-card/search-card.component';
import { UserState, UserStateI, UserStateT } from '../../state/user.state';
import { ContactService } from '../../services/contact.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, SearchCardComponent, NgIf, NgFor]
})
export class SearchPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly userState = inject(UserState);
  private readonly contactService = inject(ContactService);
  readonly users: WritableSignal<Partial<UserStateI>[]> = signal([]);
  private readonly actionSheetCtrl: ActionSheetController = inject(ActionSheetController);
  private readonly selectedUser: WritableSignal<UserStateT> = signal(null);


  constructor() { }

  ngOnInit() {
  }

  search(event:any){
    const value = event?.target?.value;
    if(value == ''){
      this.users.set([]);
      return;
    }
    this.userService.search(value).subscribe((res)=>{
      const contacts = this.userState.getUser?.contacts;
      const users = res.map((user:any)=>{
        const exist = contacts?.find((contact) => contact?._id === user?._id);
        if(exist){
          return {
            ...user,
            isAdded: true
          }
        }
        return user;
      });
      this.users.set(users);
    });
  }

  clear(){
    this.users.set([]);
  }

  async inviteUser(event:any){
    this.selectedUser.set(event);
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Invite User',
      buttons: [
        {
          text: 'Add',
          data: {
            action: 'add',
          },
          handler:() => this.handleInvite()
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

  handleInvite(){
    this.contactService.sendInvite(this.selectedUser()?.username as string).subscribe((res)=>{
    })
  }


  open(event:any){

  }

}
