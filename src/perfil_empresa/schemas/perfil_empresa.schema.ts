import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PerfilEmpresaDocument = PerfilEmpresa & Document;

@Schema({ timestamps: true })
export class PerfilEmpresa {
  @Prop({ required: true })
  eslogan: string;

  @Prop({ required: true })
  mision: string;

  @Prop({ required: true })
  vision: string;

}

export const PerfilEmpresaSchema = SchemaFactory.createForClass(PerfilEmpresa);
