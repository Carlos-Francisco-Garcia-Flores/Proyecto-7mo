import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogoDocument = Logo & Document;

@Schema({ timestamps: true })
export class Logo {
  @Prop({ required: true })
  link: string;

  @Prop({ default: false })
  vigente: boolean;
}

export const LogoSchema = SchemaFactory.createForClass(Logo);
