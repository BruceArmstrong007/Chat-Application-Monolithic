import { PubSubService, RedisProvider } from '@app/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {

  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly pubSubService: PubSubService,) {
       this.redisProvider.publisher.set('key', 'value');
      const cachedValue =  this.redisProvider.publisher.get('key');
      console.log(cachedValue);
      const channel = 'test-channel';
      this.pubSubService.subscribe(channel, (message) => {
        console.log('Received message:', message);
      });
  }

  async handleConnection(client: Server) {
    const channel = 'test-channel';
    await this.pubSubService.publish(channel, 'Hello, world!');
  }

  async handleDisconnect(client: Server) {
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(@MessageBody() data: { sender: string; message: string }) {
  }
}