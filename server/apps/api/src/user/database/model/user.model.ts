import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/passport';
import { Types, Document } from 'mongoose';

@Schema({ _id: false, versionKey: false, timestamps: true })
export class Contacts extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId; // Reference to other users

  @Prop({ required: true })
  status: string;
  
}

const ContactSchema = SchemaFactory.createForClass(Contacts);

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

  @Prop({ type: [ContactSchema], default: []  ,  validate: [
    (contacts) => contacts.length <= 100,
    'Limit Exceeded',
  ], })
  contacts: Contacts[];

  @Prop({ type: [ContactSchema], default: [] ,  validate: [
    (sentInvites) => sentInvites.length <= 50,
    'Limit Exceeded',
  ], })
  sentInvites: Contacts[];

  @Prop({ type: [ContactSchema], default: [] ,  validate: [
    (receivedInvites) => receivedInvites.length <= 50,
    'Limit Exceeded',
  ],})
  receivedInvites: Contacts[];
}
export const UserSchema = SchemaFactory.createForClass(User);
