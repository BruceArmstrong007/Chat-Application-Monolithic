import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export interface RedisJson {
  json : any
}

@Injectable()
export class RedisProvider {
  public publisher: Redis & RedisJson;
  public subscriber: Redis& RedisJson;

  constructor(config : ConfigService) {
    try{
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
      db:0
    });
    }catch(error){
      console.log(error)
    }

    this.publisher.on('error', (error) => {
      // console.error('Redis connection error:', error.message);
    });

    this.subscriber.on('error', (error) => {
      // console.error('Redis connection error:', error.message);
    });
  }
}