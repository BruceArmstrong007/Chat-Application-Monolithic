import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractDocument {
  @Prop({required:true,unique:true, lowercase: true, trim: true })
  username: string;

  @Prop({required:true})
  password: string;
  
  @Prop({min: 1 , max: 50})
  name: string;
  
  @Prop({min: 1 , max: 500})
  bio: string;

  @Prop()
  profileURL: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    validate: [
      (contacts) => contacts.length <= 100,
      'Limit Exceeded',
    ],
  })
  contacts: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }],
    validate: [
      (sentRequests) => sentRequests.length <= 50,
      'Limit Exceeded',
    ],
  })
  sentRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }],
  validate: [
    (receivedRequests) => receivedRequests.length <= 50,
    'Limit Exceeded',
  ],
 })
  receivedRequests: Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);