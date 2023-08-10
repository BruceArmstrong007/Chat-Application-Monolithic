import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserSocketService } from './sockets/user-socket.service';
import { MessageSocketService } from './sockets/message-socket.service';
import { ChatsPage } from './components/chats/chats.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, ChatsPage]
})
export class UserPage implements OnInit {
  private readonly userSocket = inject(UserSocketService);
  private readonly messageSocket = inject(MessageSocketService);

  ngOnInit() {
    this.userSocket.establishConnection();
    this.messageSocket.getMessages();
  }

}
