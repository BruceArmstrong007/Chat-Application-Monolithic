import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserSocketService } from './sockets/user-socket.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class UserPage implements OnInit {
  private readonly userSocket = inject(UserSocketService);

  ngOnInit() {
    this.userSocket.establishConnection();
  }

}
