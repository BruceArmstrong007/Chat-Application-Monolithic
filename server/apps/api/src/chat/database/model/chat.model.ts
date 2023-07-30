import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum ChatTypes{
    CHAT = 'chat',
    CALL = 'call',
    FILE = 'file'
}

export enum Actions{
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    REJECTED = 'rejected',
    CANCELED = 'canceled'
    

}


@Schema({versionKey:false, timestamps:true})
export class Chat extends Document {

 @Prop({required:true})
 sender: Types.ObjectId;
 
 @Prop({required:true})
 receiver: Types.ObjectId;
 
 @Prop({maxlength: 255})
 message: string;
 
 @Prop({required: true})
 type: ChatTypes;
  
 @Prop()
 action: Actions;
 

} 

export const ChatSchema = SchemaFactory.createForClass(Chat);