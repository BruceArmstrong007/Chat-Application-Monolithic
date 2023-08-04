import { Injectable } from '@nestjs/common';
import { ChatRepository } from './database/repository/chat.repository';
import { Types } from 'mongoose';
import { SocketWithAuth } from './middleware/ws-auth.middleware';

export enum KEYS {
  ONLINE_USERS = 'online_users'
}

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {
  }

  async addUserOnline(userID: string, socketID: string){
    this.chatRepository.set(userID, socketID, 60);
  }

  async removeUserOnline(userID: string){
    this.chatRepository.del(userID);
  }

  async activeUsers(userID: string){
    const contactIDs = await this.getContacts(userID);
    const contacts = await Promise.all(
      contactIDs.map(async (_id: Types.ObjectId) => {
        const id = _id.toString();
        const socketID = await this.chatRepository.get(id);
        return {
          id,
          socketID: socketID,
          isOnline: socketID ? true : false,
        };
      }),
    );
    return contacts;
  }

  async connectUserChannels(userID: string, client: SocketWithAuth){
    const contactIDs = await this.getContacts(userID);
    contactIDs.forEach(async (contactID: string) => {
      const roomID = [userID, contactID].sort().join('-');
      client.join(roomID);
    });

  }




  private async getContacts(userID: string): Promise<any[]> {
    const users = await this.chatRepository.getContacts(userID);
    return users.flatMap((user) => user?._id);
  }

}