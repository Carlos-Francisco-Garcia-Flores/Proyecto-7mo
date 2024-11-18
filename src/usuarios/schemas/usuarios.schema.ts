import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlobOptions } from 'buffer';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  
  @Prop({ required: true, unique: true })
  correo_Electronico: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  estado: string;  

  @Prop({ required: true })
  bloqueado: boolean;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
