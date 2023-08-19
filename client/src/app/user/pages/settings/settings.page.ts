import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ThemeService } from 'src/shared/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class SettingsPage {
  mode!: boolean;
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  constructor() {
    this.mode = this.themeService.getTheme;
   }


  darkMode(){
    this.themeService.setTheme = this.mode;
  }

  logout(){
    this.authService.logout().subscribe(()=>{});
  }

}
