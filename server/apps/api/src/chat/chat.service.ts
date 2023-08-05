import { Injectable } from '@nestjs/common';
import { ChatRepository } from './database/repository/chat.repository';
import { Types } from 'mongoose';
import { SocketWithAuth } from './middleware/ws-auth.middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './gateway/message/message.interface';
import { Options } from '@app/common';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {



  }

  async addUserOnline(userID: string, socketID: string) {
    this.chatRepository.set(userID, socketID, 60);
  }

  async removeUserOnline(userID: string) {
    this.chatRepository.del(userID);
  }

  async activeUsers(userID: string): Promise<any> {
    const contactIDs = await this.getContacts(userID);
    return contactIDs.map(async (_id: Types.ObjectId) => {
      const id = _id.toString();
      const socketID = await this.chatRepository.get(id);
      return {
        id,
        socketID: socketID,
        isOnline: socketID ? true : false,
      };
    });
  }

  async connectUserChannels(userID: string, client: SocketWithAuth) {
    const roomIDs = await this.getRoomIDs(userID);
    roomIDs.forEach((roomID) => client.join(roomID));
  }

  async getUserMessages(userID: string): Promise<any[]> {
    const roomIDs = await this.getRoomIDs(userID);
    const messages = await roomIDs.map(async (roomID) => {
      return {
        roomID: roomID,
        messages: await this.chatRepository.jsonGet(`rooms:${roomID}`, 0, -1),
      };
    });
    return messages;
  }


  async sendMessage(data: Partial<Message>) {
    if (data.type === Options.TYPING) {
      await this.chatRepository.publish('typing', JSON.stringify(data));
      return;
    }
    data.messageID = uuidv4();
    await this.chatRepository.publish('user-message', JSON.stringify(data));
  }

  async receiveMessage(server: Server, message: Partial<Message>){
    const roomID = await this.chatRepository.generateRoomIDs(
      message?.senderID,
      message?.receiverID,
    );
    this.chatRepository.set(`rooms:${roomID}`, JSON.stringify(message));
    console.log(roomID, message)
    server.to(roomID).emit(JSON.stringify(message));
  }

  async typingMessage(server: Server, message: Partial<Message>){
    const roomID = await this.chatRepository.generateRoomIDs(
      message?.senderID,
      message?.receiverID,
    );
    server.to(roomID).emit(JSON.stringify(message));
  }

  private async getContacts(userID: string): Promise<any[]> {
    const users = await this.chatRepository.getContacts(userID);
    return users.flatMap((user) => user?._id);
  }

  private async getRoomIDs(userID: string): Promise<any[]> {
    const contactIDs = await this.getContacts(userID);
    return contactIDs.map(async (contactID: string) =>
      this.chatRepository.generateRoomIDs(userID, contactID),
    );
  }
}
