import { RedisProvider } from '@app/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatRepository } from '../../database/repository/chat.repository';

@WebSocketGateway({ namespace: 'message' })
export class MessageGateway {

  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly chatRepository: ChatRepository,
  ) {
      const channel = 'test-channel';
      this.chatRepository.subscribe(channel, (message) => {
        console.log('Received message:', message);
      });
  }

  async handleConnection(client: Server) {
    const channel = 'test-channel';
    await this.chatRepository.publish(channel, 'Hello, world!');
  }

  async handleDisconnect(client: Server) {
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(@MessageBody() data: { sender: string; message: string }) {
  }
}