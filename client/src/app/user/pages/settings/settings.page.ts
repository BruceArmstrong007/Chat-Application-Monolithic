import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ResetPasswordPage } from 'src/app/auth/pages/reset-password/reset-password.page';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ThemeService } from 'src/shared/services/theme.service';
import { UserState } from '../../state/user.state';
import { ProfileComponent } from 'src/shared/components/profile/profile.component';

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
  private readonly userState = inject(UserState);
  private readonly modalCtrl: ModalController = inject(ModalController);
  constructor() {
    this.mode = this.themeService.getTheme;
   }


  darkMode(){
    this.themeService.setTheme = this.mode;
  }

  logout(){
    this.authService.logout().subscribe(()=>{});
  }

  async openProfile(){
    const modal = await this.modalCtrl.create({
      component: ProfileComponent,
      componentProps: {
        user: {
          name: this.userState?.getUser?.name,
          bio: this.userState?.getUser?.bio,
          profileURL: this.userState?.getUser?.profileURL,
        }
      },
    });
    modal.present();
  }

  async openResetPassword(){
    const modal = await this.modalCtrl.create({
      component: ResetPasswordPage,
      componentProps: {
        user: this.userState.getUser
      },
    });
    modal.present();
  }

}
