import { NgIf } from '@angular/common';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserStateT } from 'src/app/user/state/user.state';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class SearchCardComponent  implements OnInit {
  @Output() cardClick: EventEmitter<any> = new EventEmitter();
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();
  @Input() user!: any;
  constructor() { }

  ngOnInit() {}

}
