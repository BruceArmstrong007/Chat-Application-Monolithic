import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from '../model/chat.model';
import { Model } from 'mongoose';
@Injectable()
export class ChatRepository{
    constructor(@InjectModel(Chat.name) private readonly chatModel : Model<Chat>){}


}