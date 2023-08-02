import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RedisProvider } from '@app/common';
import { User, UserSchema } from '../user/database/model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './gateway/message/message.gateway';
import { UserGateway } from './gateway/user/user.gateway';
import { EventGateway } from './gateway/event/event.gateway';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    RedisProvider,
    MessageGateway,
    UserGateway,
    EventGateway
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
   ]
})
export class ChatModule {}
