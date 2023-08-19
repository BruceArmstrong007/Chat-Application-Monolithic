import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgClass, DatePipe]
})
export class MessageCardComponent implements OnInit {
  @Input() chatData!: any;
  constructor() { }

  ngOnInit() {

  }

}
