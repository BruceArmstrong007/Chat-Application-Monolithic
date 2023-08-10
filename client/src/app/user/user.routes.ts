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
          import('./components/chats/chats.page').then((m) => m.ChatsPage),
      },
      {
        path: 'friends',
        loadComponent: () =>
          import('./components/friends/friends.page').then((m) => m.FriendsPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./components/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/settings.page').then((m) => m.SettingsPage),
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
    loadComponent: () => import('./components/settings/settings.page').then( m => m.SettingsPage)
  },

];
