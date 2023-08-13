import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserSocketService } from './sockets/user-socket.service';
import { MessageSocketService } from './sockets/message-socket.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class UserPage{
  private readonly userSocket = inject(UserSocketService);
  private readonly messageSocket = inject(MessageSocketService);

  constructor() {

    this.userSocket.establishConnection();
    this.messageSocket.getMessages();
  }

}
