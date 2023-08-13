import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: []
})
export class AppComponent{
  private readonly notificationService = inject(NotificationService);
  constructor() {
    this.notificationService.register();
  }
}
