import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserResolver } from 'src/shared/resolver/user.resolver';
import { PersistResolver } from 'src/shared/resolver/persist.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children:[
      {
        path: 'auth',
        resolve:[PersistResolver],
        loadChildren: () => import('./auth/auth.routes').then((m) => m.routes)
      },
      {
        path: 'user',
        canActivate:[AuthGuard],
        resolve:[UserResolver],
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
