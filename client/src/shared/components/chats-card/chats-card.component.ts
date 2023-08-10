import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserStateI } from 'src/app/user/state/user.state';

@Component({
  selector: 'app-chats-card',
  templateUrl: './chats-card.component.html',
  styleUrls: ['./chats-card.component.scss'],
  standalone: true,
  imports:[IonicModule]
})
export class ChatsCardComponent  implements OnInit {
  @Input() contact!: UserStateI;
  @Output() cardClick = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
