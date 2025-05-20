import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type Document } from 'mongoose';

@Schema()
export class BlacklistedToken {
  @Prop({ required: true })
  token: string;
}

export const BlacklistedTokenSchema = SchemaFactory.createForClass(BlacklistedToken);
export type BlacklistedTokenDocument = Document & BlacklistedToken;

