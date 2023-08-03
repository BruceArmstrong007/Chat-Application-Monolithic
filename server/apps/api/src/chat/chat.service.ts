import { Injectable } from '@nestjs/common';
import { ChatRepository } from './database/repository/chat.repository';
import { Types } from 'mongoose';

export enum KEYS {
  ONLINE_USERS = 'onlineusers'
}

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {
  }

  async addUserOnline(userID: string){
    this.chatRepository.setAddElts(KEYS.ONLINE_USERS, [userID]);
  }

  async removeUserOnline(userID: string){
    this.chatRepository.setRemoveElt(KEYS.ONLINE_USERS, userID);
  }

  async activeUsers(userID: string){
    const users = (await this.chatRepository.getContacts(userID));
    const contactIDs = users.flatMap((user) => user?._id);
    const contacts = await Promise.all(contactIDs.map(async (_id: Types.ObjectId)=> {
      const id = _id.toString();
      const isOnline = await this.chatRepository.setFindElt(
        KEYS.ONLINE_USERS,
        id,
      );
      return {
        id,
        isOnline: isOnline ? true : false
      };
    }));
    
    return contacts;
  }

}