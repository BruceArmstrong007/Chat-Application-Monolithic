import { Injectable, WritableSignal, signal } from "@angular/core";

export interface MessageStateI {
  messageID: string;
  senderID: string;
  receiverID: string;
  timestamp: string;
  content: string;
  status: string;
  actions: string;
  type: string;
}

export interface MessageStateW {
  messages: Partial<MessageStateI>[];
  roomID: string;
  typing: any[] | null
}

export type MessageStateT = Partial<MessageStateW[]> | null;
@Injectable({
  providedIn: 'root'
})
export class MessageState {
  messageState: WritableSignal<MessageStateT> = signal(null);


  get getMessageState(){
    return this.messageState();
  }

  set setMessageState(value : MessageStateT){
    this.messageState.set(value);
  }
}
