import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 25,
  })
  username: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ maxlength: 50 })
  name: string;
  
  @Prop({ maxlength: 500 })
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
      (sentInvites) => sentInvites.length <= 50,
      'Limit Exceeded',
    ],
  })
  sentInvites: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }],
  validate: [
    (receivedInvites) => receivedInvites.length <= 50,
    'Limit Exceeded',
  ],
 })
  receivedInvites: Types.ObjectId[];


}


export const UserSchema = SchemaFactory.createForClass(User);

