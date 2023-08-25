import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
@Injectable()
export class RedisProvider {
  public publisher: RedisClientType;
  public subscriber: RedisClientType;


  constructor(config: ConfigService) {
    this.publisher = createClient({
      url: config.get('REDIS_URI'),
    });

    this.subscriber = this.publisher.duplicate(); 


    this.publisher.on('error', (error) => {
      console.error(error.message);
    });

    this.subscriber.on('error', (error) => {
      console.error(error.message);
    });

    this.publisher.connect();
    this.subscriber.connect();
  }
}