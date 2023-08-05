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
          import('./chats/chats.page').then((m) => m.ChatsPage),
      },
      {
        path: 'friends',
        loadComponent: () =>
          import('./friends/friends.page').then((m) => m.FriendsPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./search/search.page').then((m) => m.SearchPage),
      },
      {
        path: '',
        redirectTo: '/user/chats',
        pathMatch: 'full',
      },
    ],
  },
];
