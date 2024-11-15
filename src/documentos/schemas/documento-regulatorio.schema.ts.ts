// src/documentos-regulatorios/schemas/documento-regulatorio.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocumentoRegulatorio extends Document {
  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ default: null })
  fechaFin: Date;

  @Prop({ default: false })
  vigente: boolean;

  @Prop({ default: false })
  eliminado: boolean;
}

export const DocumentoRegulatorioSchema = SchemaFactory.createForClass(DocumentoRegulatorio);
