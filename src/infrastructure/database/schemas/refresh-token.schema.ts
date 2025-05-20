import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class RefreshToken {
  @Prop({ required: true, type: String })
  userId: string; // or ObjectId if you’re referencing a user

  @Prop({ required: true, type: String })
  tokenHash: string; // hashed refresh token

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ type: String, default: null })
  ip?: string;

  @Prop({ type: String, default: null })
  userAgent?: string;
}


export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
export type RefreshTokenDocument = Document & RefreshToken;
