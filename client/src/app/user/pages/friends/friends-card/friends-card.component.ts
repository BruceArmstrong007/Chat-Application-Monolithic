import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserStateI } from 'src/app/user/state/user.state';

@Component({
  selector: 'app-friends-card',
  templateUrl: './friends-card.component.html',
  styleUrls: ['./friends-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class FriendsCardComponent  implements OnInit {
  @Input() contact!: UserStateI;
  @Input() section!: any;
  @Output() cardClick: EventEmitter<any> = new EventEmitter();
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
