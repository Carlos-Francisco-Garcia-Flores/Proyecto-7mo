import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogoDocument = Logo & Document;

@Schema({ timestamps: true })
export class Logo {
  @Prop({ required: true })
  publicId: string; // ID único de Cloudinary

  @Prop({ required: true })
  url: string; // URL del logotipo en Cloudinary
}

export const LogoSchema = SchemaFactory.createForClass(Logo);
