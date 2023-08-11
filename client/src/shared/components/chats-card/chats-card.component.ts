import { Component, Input, OnInit, Output, EventEmitter, inject, Signal, computed } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserState, UserStateI } from 'src/app/user/state/user.state';
  import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chats-card',
  templateUrl: './chats-card.component.html',
  styleUrls: ['./chats-card.component.scss'],
  standalone: true,
  imports:[IonicModule ,NgClass]
})
export class ChatsCardComponent  implements OnInit {
  @Input() contact!: UserStateI;
  private readonly usersState = inject(UserState);
  isOnline!: Signal<boolean>;
  @Output() cardClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.isOnline = computed(() => {
      let state = false;
      this.usersState.onlineUsers()?.forEach((onlineUser:any) => {
        if(onlineUser.id === this.contact._id){
          state = onlineUser.isOnline;
        }
      });
      return state;
    })
  }

}
