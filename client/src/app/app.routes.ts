import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children:[
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.routes)
      },
      {
        path: 'user',
        canActivate:[],
        loadChildren: () => import('./user/user.routes').then((m) => m.routes)
      },
      {
        path: '',
        redirectTo: '/user/chats',
        pathMatch: 'full'
      },
    ]
  }
];
