import { Injectable, WritableSignal, signal } from "@angular/core";


export type MessageStateT = Partial<MessageStateI> | null;

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

@Injectable({
  providedIn: 'root'
})
export class MessageState {
  readonly messageState : WritableSignal<MessageStateT> = signal(null);


  get getMessageState(){
    return this.messageState();
  }

  set setMessageState(value : MessageStateT){
    this.messageState.set(value);
  }
}
