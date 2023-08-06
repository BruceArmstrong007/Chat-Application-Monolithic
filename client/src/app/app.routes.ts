import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from 'src/shared/guards/auth.guard';

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
        canActivate:[AuthGuard],
        loadChildren: () => import('./user/user.routes').then((m) => m.routes)
      },
      {
        path: '**',
        redirectTo: '/user/chats',
        pathMatch: 'full'
      },
    ]
  }
];
