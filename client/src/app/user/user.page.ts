import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class UserPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() { }

  ngOnInit() {
  }

}
