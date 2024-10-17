import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InformacionDocument = Informacion & Document;

@Schema({ collection: 'informacion' }) 
export class Informacion {
  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  descripcion: string;
}

export const InformacionSchema = SchemaFactory.createForClass(Informacion);
