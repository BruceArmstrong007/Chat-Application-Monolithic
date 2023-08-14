import { Injectable } from '@nestjs/common';
import { RedisProvider } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'apps/api/src/user/database/model/user.model';

@Injectable()
export class ChatRepository {
  constructor(
    private readonly redisProvider: RedisProvider,
    @InjectModel(User.name) public readonly userModel: Model<User>,
  ) {}

  subscribe(channel: string, callback: (message: string) => void) {
    this.redisProvider.subscriber.subscribe(channel, (message, chan) => {
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
    if (!ttl) {
      await this.redisProvider.publisher.set(key, value);
      return;
    }
    await this.redisProvider.publisher.set(key, value, { EX: ttl });
  }

  async get(key: string): Promise<string> {
    return await this.redisProvider.publisher.get(key);
  }

  async del(key: string) {
    await this.redisProvider.publisher.del(key);
  }

  async listAddElts(key: string, value: any) {
    await this.redisProvider.publisher.rPush(
      `room_messages:${key}`,
      JSON.stringify(value),
    );
  }

  async listGetElts(key: string, start: number, end: number): Promise<any> {
    return await this.redisProvider.publisher.lRange(key, start, end);
  }

  generateRoomIDs(id1: any, id2: any): string {
    return [id1, id2].sort().join('-');
  }

  async setAddElts(key: string, value: string[]) {
    await this.redisProvider.publisher.sAdd(key, value);
  }

  async setRemoveElt(key: string, value: string) {
    await this.redisProvider.publisher.sRem(key, value);
  }

  async setFindElt(key: string, value: string) {
    return this.redisProvider.publisher.sIsMember(key, value);
  }

  async jsonArraySetOrAppend(key: string, value: any, option?: string) {
    const isExist = await this.jsonGet(key);
    if (!option) {
      option = '$';
    }
    if (isExist) {
      const chat = JSON.stringify(value);
      await this.redisProvider.publisher.json.arrAppend(key, option, chat);
    } else {
      const chat = JSON.stringify([value]);
      await this.jsonSet(key, option, chat);
    }

    // const option = !condition ? '$' : '$' + condition;
    // console.info(option)
    // await this.redisProvider.publisher.json.arrAppend(key, option, [value], {
    //   NX: true,
    // });
  }

  async jsonGet(key: string, option?: string) {
    return await this.redisProvider.publisher.json.get(key, {
      path: !option ? '$' : option,
    });
  }

  async jsonSet(key: string, value: string, option?: string) {
    if (!option) {
      option = '$';
    }
    await this.redisProvider.publisher.json.set(key, option, value);
  }
}
