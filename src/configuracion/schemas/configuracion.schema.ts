import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'configuracion' }) // Nombre fijo de la colección
export class Configuracion extends Document {
  @Prop({ required: true, default: 5 }) // Número máximo de intentos fallidos
  maxFailedAttempts: number;

  @Prop({ required: true, default: 20 }) // Tiempo de bloqueo en minutos
  lockTimeMinutes: number;
}

export type ConfiguracionDocument = Configuracion & Document; // Tipo del documento Mongoose
export const ConfiguracionSchema = SchemaFactory.createForClass(Configuracion);
