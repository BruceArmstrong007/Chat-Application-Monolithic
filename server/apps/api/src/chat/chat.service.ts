import { Injectable } from '@nestjs/common';
import { RedisProvider } from '@app/common';

@Injectable()
export class ChatService {
  constructor(private readonly redisProvider: RedisProvider) {
  
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.redisProvider.subscriber.subscribe(channel);
    this.redisProvider.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.redisProvider.publisher.publish(channel, message);
  }
}