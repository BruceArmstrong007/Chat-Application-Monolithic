import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './database/repository/chat.repository';
import { Chat, ChatSchema } from './database/model/chat.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatRepository],
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }])
  ]
})
export class ChatModule {}
