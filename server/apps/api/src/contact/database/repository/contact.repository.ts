import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../../user/database/model/user.model';
import { Fields, UpdateArray } from '@app/common';

@Injectable()
export class ContactRepository {
  protected readonly logger = new Logger(ContactRepository.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
  ) {}

  async findAndPopulate(
    username: string,
    fields: Fields[],
  ): Promise<User | null> {
    let user = await this.userModel.findOne({ username });
    await fields.forEach(async (field) => {
      await user.populate(field+'.user');
    });
    return await user;
  }

  async updateUser(username: string, updates: object): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ username: username }, updates, { new: true })
      .exec();
  }

  async updateUserArray(
    user: any,
    id: string,
    option: UpdateArray,
    field: Fields,
  ) {
    const existingRecord = await user[field]?.find((record) =>
      record?.user.equals(id),
    );

    if (UpdateArray.PUSH === option) {
      if (existingRecord) {
        throw new BadRequestException('Already done.');
      }
      user[field].push({ user: new Types.ObjectId(id), status: 'sent' });
      await user.save();
    }
    if (UpdateArray.PULL === option) {
      if (!existingRecord) {
        throw new BadRequestException('Does not exist.');
      }
      user[field].pull({ user: new Types.ObjectId(id) });
      await user.save();
    }
  }
}
