import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    return await this.userModel.findOne({ username }).populate('contacts').populate('sentInvites').populate('receivedInvites').exec();
  }

  async searchUsers(keyword: string, select?:string): Promise<User[]> {
    const regex = new RegExp(keyword, 'i'); 
    const query = this.userModel.find({ username: regex })
    if (select) {
      query.select(select);
    }
    return await query.exec(); 
  }

  async createUser(username: string, password: string): Promise<User> {
    const newUser = new this.userModel({ username, password });
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