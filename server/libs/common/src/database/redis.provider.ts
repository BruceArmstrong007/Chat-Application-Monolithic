import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisProvider {
  public publisher: Redis.Redis;
  public subscriber: Redis.Redis;

  constructor(config : ConfigService) {
    this.publisher = new Redis({
      host: config.get('REDIS_HOST'), 
      port:  config.get('REDIS_PORT'),   
      password:  config.get('REDIS_PASS'),
      db: 0
    });

    this.subscriber = new Redis({
      host: config.get('REDIS_HOST'), 
      port:  config.get('REDIS_PORT'),   
      password:  config.get('REDIS_PASS'), 
    });
  }
}