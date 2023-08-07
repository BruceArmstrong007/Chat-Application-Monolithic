import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatsPage implements OnInit {
  items = [
    1,2,4,5,546,646,456,46,465,645,64,64,6,46,45,3
  ];
  constructor() { }

  ngOnInit() {
  }

}
