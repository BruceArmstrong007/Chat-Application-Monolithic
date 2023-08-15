import { Component, inject, OnInit, effect } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NotificationService } from 'src/shared/services/notification.service';
import { StorageService } from 'src/shared/services/storage.service';
import { TokenService } from '../shared/services/token.service';
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: []
})
export class AppComponent implements OnInit{
  private readonly notificationService = inject(NotificationService);
  private readonly storageService = inject(StorageService);
  private readonly tokenService = inject(TokenService);
  private readonly themeService = inject(ThemeService);
  constructor() {
    this.notificationService.register();
      effect(()=> {
          const mode = this.themeService.darkTheme();
          document.body.classList.toggle('dark',mode);
      })
  }

  async ngOnInit() {
    await this.storageService.init();
    await this.tokenService.init();
    await this.themeService.init();
  }
}
