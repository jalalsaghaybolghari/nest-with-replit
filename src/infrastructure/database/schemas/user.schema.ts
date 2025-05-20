import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document } from 'mongoose';

@Schema({ timestamps: true })
class User {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = Document & User;
