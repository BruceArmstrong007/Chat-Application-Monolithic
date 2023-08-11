import { Routes } from '@angular/router';
import { AuthPage } from './auth.page';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password.page').then((m) => m.ResetPasswordPage),
      },
      {
        path: '**',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
];
