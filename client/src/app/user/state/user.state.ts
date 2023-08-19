import { Injectable, WritableSignal, signal } from "@angular/core";

export type UserStateT = Partial<UserStateI> | null;

export type UserRef = UserStateI[];

export interface UserStateI {
  _id: string,
  username: string,
  name: string,
  bio: string,
  profileURL: string,
  contacts: UserRef,
  sentInvites: UserRef,
  receivedInvites: UserRef,
  createdAt: string,
  updatedAt: string
}

export interface OnlineUsersState {
  id: string,
  socketID: string,
  isOnline: boolean
}

export type OnlineUsersT = Partial<OnlineUsersState>[] | null;


@Injectable({
  providedIn: 'root'
})
export class UserState {
  readonly user : WritableSignal<UserStateT> = signal(null);
  readonly onlineUsers: WritableSignal<OnlineUsersT> = signal(null);

  get getUser(){
    return this.user();
  }

  set setUser(value : UserStateT){
    this.user.set(value);
  }


  get getOnlineUsers(){
    return this.onlineUsers();
  }

  set setOnlineUsers(value : OnlineUsersT){
    this.onlineUsers.set(value);
  }

}
