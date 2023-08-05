import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { User, UserSchema } from '../user/database/model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactRepository } from './database/repository/contact.repository';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ]
})
export class ContactModule {}
