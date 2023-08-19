import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { User, UserSchema } from '../user/database/model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRepository } from '../chat/database/repository/chat.repository';
import { ContactRepository } from './database/repository/contact.repository';
import { RedisProvider } from '@app/common';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRepository, ChatRepository, RedisProvider],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
})
export class ContactModule {}
