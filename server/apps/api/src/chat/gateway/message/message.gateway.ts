import { RedisProvider } from '@app/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../../chat.service';

@WebSocketGateway({namespace:'message'})
export class MessageGateway {

  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly chatService: ChatService,
  ) {
      const channel = 'test-channel';
      this.chatService.subscribe(channel, (message) => {
        console.log('Received message:', message);
      });
  }

  async handleConnection(client: Server) {
    const channel = 'test-channel';
    await this.chatService.publish(channel, 'Hello, world!');
  }

  async handleDisconnect(client: Server) {
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(@MessageBody() data: { sender: string; message: string }) {
  }
}