import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido_Paterno: string;

  @Prop({ required: true })
  apellido_Materno: string;

  @Prop({ required: true, unique: true })
  correo_Electronico: string;

  @Prop({ required: true })
  numero_Telefonico: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ required: true })
  sexo: string;

  @Prop({ required: true })
  tipo_Usuario: string;

  @Prop({ required: true })
  password: string;  

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
