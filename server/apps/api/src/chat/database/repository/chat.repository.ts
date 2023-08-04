import { Injectable } from '@nestjs/common';
import { RedisProvider } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'apps/api/src/user/database/model/user.model';

@Injectable()
export class ChatRepository {
  constructor(
    private readonly redisProvider: RedisProvider,
    @InjectModel(User.name) public readonly userModel: Model<User>,) {}

  subscribe(channel: string, callback: (message: string) => void) {
    this.redisProvider.subscriber.subscribe(channel);
    this.redisProvider.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }

  async getContacts(id: string): Promise<any[]> {
    const user = await this.userModel
      .findById(id)
      .populate('contacts', '-password')
      .exec();

    if (user) {
      return user.contacts;
    } else {
      return [];
    }
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.redisProvider.publisher.publish(channel, message);
  }

  async set(key: string, value: any, ttl?: number) {
    if (!ttl) ttl = 0;
    await this.redisProvider.publisher.set(key, value, 'EX', ttl);
  }


  async get(key: string): Promise<string> {
    return await this.redisProvider.publisher.get(key);
  }

  async del(key: string){
    await this.redisProvider.publisher.del(key);
  }

  async setAddElts(key: string, value: string[]){
    await this.redisProvider.publisher.sadd(key, ...value);
  }

  
  async setRemoveElt(key: string, value: string){
    await this.redisProvider.publisher.srem(key, value);
  }

  async setFindElt(key: string, value: string){
    return this.redisProvider.publisher.sismember(key, value);
  }

  
}