import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { User } from '../model/user.model';

@Injectable()
export class UserRepository {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
  ) {}


  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async userProfile(username: string): Promise<User | null> {
    return await this.userModel
      .findOne({ username })
      .select('-password')
      .populate('contacts.user sentInvites.user receivedInvites.user', '-password -receivedInvites -contacts -sentInvites')
      .exec();
  }

  async searchUsers(options: any,select?: string): Promise<User[]> {
    const query = this.userModel.find({ username: options });
    if (select) {
      query.select(select);
    }
    return await query.exec(); 
  }

  async createUser(username: string, password: string): Promise<User> {
    const name = 'User-' + uuidv4();
    const profileURL = 'https://picsum.photos/80/80?random=';
    const newUser = new this.userModel({
      username,
      password,
      name,
      profileURL,
    });
    return await newUser.save();
  }

  async updateUser(
    username: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ username: username }, updates, { new: true })
      .exec();
  }

  async deleteUser(username: string): Promise<User | null> {
    return await this.userModel.findOneAndDelete({username: username}).exec();
  }
}