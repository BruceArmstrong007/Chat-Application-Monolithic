import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RedisProvider } from '@app/common';
import { User, UserSchema } from '../user/database/model/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    RedisProvider,
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
   ]
})
export class ChatModule {}
