// src/social/schemas/red-social.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RedSocialDocument = RedSocial & Document;

@Schema({ collection: 'redesSociales' })
export class RedSocial {
  @Prop({ required: true, unique: true })
  tipo: string;

  @Prop({ required: true })
  link: string;
}

export const RedSocialSchema = SchemaFactory.createForClass(RedSocial);
