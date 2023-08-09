import { Injectable } from '@nestjs/common';
import { ChatRepository } from './database/repository/chat.repository';
import { SocketWithAuth } from './middleware/ws-auth.middleware';
import { v4 as uuidv4 } from 'uuid';
import { Options } from '@app/common';
import { Server } from 'socket.io';

export interface Message {
  messageID: string;
  senderID: string;
  receiverID: string;
  timestamp: string;
  content: string;
  status: string;
  actions: string;
  type: string;
}

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) { }

  async addUserOnline(userID: string, socketID: string) {
    this.chatRepository.set(userID, socketID, 60);
  }

  async removeUserOnline(userID: string) {
    this.chatRepository.del(userID);
  }

  async activeUsers(userID: string): Promise<any> {
    const contactIDs = await this.getContacts(userID);
    const contacts = [];
    for (let i = 0; i < contactIDs.length; i++) {
      const id = contactIDs[i].toString();
      const socketID = await this.chatRepository.get(id);
      const res = {
        id,
        socketID: socketID,
        isOnline: socketID ? true : false,
      };
      contacts.push(res);
    }
    return contacts;
  }

  async connectUserChannels(userID: string, client: SocketWithAuth) {
    const roomIDs = await this.getRoomIDs(userID);
    roomIDs.forEach((roomID) => client.join(roomID));
  }

  async getUserMessages(userID: string): Promise<any[]> {
    const roomIDs = await this.getRoomIDs(userID);
    const messages = [];
    for (let i = 0; i < roomIDs.length; i++) {
      const message = (await this.chatRepository.jsonGet(
        `rooms:${roomIDs[i]}`,
      )) as string;
      messages.push({
        roomID: roomIDs[i],
        // to avoid getting room messages nested in a array
        messages: message 
      })
    }    
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
    const room = `rooms:${roomID}`;
    this.chatRepository.jsonSet(room, message);    
    server.to(roomID).emit('receive-message', message);
  } 

  async typingMessage(server: Server, message: Partial<Message>){
    const roomID = await this.chatRepository.generateRoomIDs(
      message?.senderID,
      message?.receiverID,
    );
    server.to(roomID).emit('receive-message', message);
  }

  private async getContacts(userID: string): Promise<any[]> {
    const users = await this.chatRepository.getContacts(userID);
    return users.flatMap((user) => user?._id);
  }

  private async getRoomIDs(userID: string): Promise<any[]> {
    const contactIDs = await this.getContacts(userID);
    const contacts = [];
    for (let i = 0; i < contactIDs.length; i++) {
      contacts.push(this.chatRepository.generateRoomIDs(userID, contactIDs[i]));
    }
    return contacts;
  }
}
