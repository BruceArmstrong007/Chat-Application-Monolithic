import { Routes } from '@angular/router';
import { UserPage } from './user.page';

export const routes: Routes = [
  {
    path: '',
    component: UserPage,
    children: [
      {
        path: 'chats',
        loadComponent: () =>
          import('./pages/chats/chats.page').then((m) => m.ChatsPage),
      },
      {
        path: 'friends',
        loadComponent: () =>
          import('./pages/friends/friends.page').then((m) => m.FriendsPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '**',
        redirectTo: '/user/chats',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },

];
